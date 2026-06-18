const axios = require('axios');
const { Employee, LeaveBalance, PaySlip } = require('../models');
const bcrypt = require('bcryptjs');

class HrSyncService {
  constructor() {
    this.baseUrl = process.env.SIRH_BASE_URL;
    this.apiKey = process.env.SIRH_API_KEY;
    this.syncInterval = parseInt(process.env.SIRH_SYNC_INTERVAL) || 300000;
    this.intervalHandle = null;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: { 'X-API-Key': this.apiKey },
      timeout: 30000,
    });
  }

  startSync() {
    if (!this.baseUrl || !this.apiKey) {
      console.log('[HrSync] SIRH_BASE_URL or SIRH_API_KEY not configured, skipping sync');
      return;
    }

    console.log(`[HrSync] Starting sync every ${this.syncInterval}ms`);
    this.runAllSyncs();
    this.intervalHandle = setInterval(() => this.runAllSyncs(), this.syncInterval);
  }

  stopSync() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  async runAllSyncs() {
    console.log('[HrSync] Running full sync...');
    await this.syncEmployees();
    await this.syncLeaveBalances();
    await this.syncPaySlips();
    console.log('[HrSync] Full sync complete');
  }

  async syncEmployees() {
    try {
      console.log('[HrSync] Syncing employees...');
      const response = await this.client.get('/employees');
      const employees = response.data;

      if (!Array.isArray(employees)) {
        console.error('[HrSync] syncEmployees: unexpected response format');
        return;
      }

      for (const emp of employees) {
        try {
          const defaults = {
            matricule: emp.matricule,
            firstName: emp.firstName || emp.prenom,
            lastName: emp.lastName || emp.nom,
            email: emp.email,
            department: emp.department || emp.departement,
            position: emp.position || emp.poste,
            hireDate: emp.hireDate || emp.dateEmbauche,
            isActive: emp.isActive !== false,
            passwordHash: await bcrypt.hash(emp.matricule, 10), // Default password = matricule
          };

          await Employee.findOrCreate({
            where: { matricule: emp.matricule },
            defaults,
          });
        } catch (err) {
          console.error(`[HrSync] Failed to upsert employee ${emp.matricule}:`, err.message);
        }
      }

      console.log(`[HrSync] Synced ${employees.length} employees`);
    } catch (error) {
      console.error('[HrSync] syncEmployees error:', error.message);
    }
  }

  async syncLeaveBalances() {
    try {
      console.log('[HrSync] Syncing leave balances...');
      const response = await this.client.get('/leave-balances');
      const balances = response.data;

      if (!Array.isArray(balances)) {
        console.error('[HrSync] syncLeaveBalances: unexpected response format');
        return;
      }

      const currentYear = new Date().getFullYear();

      for (const bal of balances) {
        try {
          const employee = await Employee.findOne({ where: { matricule: bal.matricule } });
          if (!employee) continue;

          await LeaveBalance.upsert({
            employeeId: employee.id,
            year: bal.year || currentYear,
            type: bal.type,
            total: parseFloat(bal.total) || 0,
            used: parseFloat(bal.used) || 0,
            remaining: parseFloat(bal.remaining) || parseFloat(bal.total) - parseFloat(bal.used) || 0,
          });
        } catch (err) {
          console.error(`[HrSync] Failed to upsert leave balance for ${bal.matricule}:`, err.message);
        }
      }

      console.log(`[HrSync] Synced ${balances.length} leave balances`);
    } catch (error) {
      console.error('[HrSync] syncLeaveBalances error:', error.message);
    }
  }

  async syncPaySlips() {
    try {
      console.log('[HrSync] Syncing pay slips...');
      const response = await this.client.get('/payslips');
      const payslips = response.data;

      if (!Array.isArray(payslips)) {
        console.error('[HrSync] syncPaySlips: unexpected response format');
        return;
      }

      for (const ps of payslips) {
        try {
          const employee = await Employee.findOne({ where: { matricule: ps.matricule } });
          if (!employee) continue;

          await PaySlip.upsert({
            employeeId: employee.id,
            month: parseInt(ps.month),
            year: parseInt(ps.year),
            grossSalary: parseFloat(ps.grossSalary || ps.salairebrut) || 0,
            netSalary: parseFloat(ps.netSalary || ps.salairenet) || 0,
            employerCharges: parseFloat(ps.employerCharges || ps.cotisationsEmployeur) || 0,
            employeeCharges: parseFloat(ps.employeeCharges || ps.cotisationsSalarie) || 0,
            pdfPath: ps.pdfPath || null,
            sirhReference: ps.reference || ps.sirhReference || null,
          });
        } catch (err) {
          console.error(`[HrSync] Failed to upsert payslip for ${ps.matricule}:`, err.message);
        }
      }

      console.log(`[HrSync] Synced ${payslips.length} pay slips`);
    } catch (error) {
      console.error('[HrSync] syncPaySlips error:', error.message);
    }
  }

  async pushLeaveRequest(leaveRequest) {
    if (!this.baseUrl || !this.apiKey) return;

    try {
      const employee = await Employee.findByPk(leaveRequest.employeeId);
      if (!employee) throw new Error('Employee not found');

      const response = await this.client.post('/leave-requests', {
        matricule: employee.matricule,
        type: leaveRequest.type,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        daysCount: leaveRequest.daysCount,
        reason: leaveRequest.reason,
        internalId: leaveRequest.id,
      });

      if (response.data && response.data.reference) {
        await leaveRequest.update({ sirhReference: response.data.reference });
      }

      console.log(`[HrSync] Leave request ${leaveRequest.id} pushed to SIRH`);
    } catch (error) {
      console.error(`[HrSync] pushLeaveRequest error for ${leaveRequest.id}:`, error.message);
      throw error;
    }
  }
}

module.exports = new HrSyncService();
