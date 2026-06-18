let firebaseApp = null;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.log('[Notifications] Firebase not configured, skipping initialization');
    return null;
  }

  try {
    const admin = require('firebase-admin');
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      return firebaseApp;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('[Notifications] Firebase initialized');
    return firebaseApp;
  } catch (error) {
    console.error('[Notifications] Firebase init error:', error.message);
    return null;
  }
};

const notificationService = {
  async sendToEmployee(employeeId, title, body, data = {}) {
    const app = initFirebase();
    if (!app) return null;

    try {
      const { Employee } = require('../models');
      const employee = await Employee.findByPk(employeeId);

      if (!employee || !employee.fcmToken) {
        console.log(`[Notifications] No FCM token for employee ${employeeId}`);
        return null;
      }

      const admin = require('firebase-admin');
      const message = {
        token: employee.fcmToken,
        notification: { title, body },
        data: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
        android: {
          notification: { sound: 'default', priority: 'high' },
        },
        apns: {
          payload: { aps: { sound: 'default' } },
        },
      };

      const result = await admin.messaging().send(message);
      console.log(`[Notifications] Sent to employee ${employeeId}:`, result);
      return result;
    } catch (error) {
      console.error(`[Notifications] sendToEmployee error for ${employeeId}:`, error.message);
      return null;
    }
  },

  async sendLeaveApproved(employeeId, leaveRequest) {
    return this.sendToEmployee(
      employeeId,
      'Congé approuvé',
      `Votre demande de congé du ${leaveRequest.startDate} au ${leaveRequest.endDate} a été approuvée.`,
      {
        type: 'leave_approved',
        leaveRequestId: leaveRequest.id,
        leaveType: leaveRequest.type,
      }
    );
  },

  async sendLeaveRejected(employeeId, leaveRequest, reason) {
    return this.sendToEmployee(
      employeeId,
      'Congé refusé',
      `Votre demande de congé du ${leaveRequest.startDate} au ${leaveRequest.endDate} a été refusée.${reason ? ' Motif: ' + reason : ''}`,
      {
        type: 'leave_rejected',
        leaveRequestId: leaveRequest.id,
        leaveType: leaveRequest.type,
        reason: reason || '',
      }
    );
  },
};

module.exports = notificationService;
