import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/data/models/payslip_model.dart';
import 'package:hr_mobile/data/repositories/payslip_repository.dart';
import 'package:hr_mobile/presentation/providers/payslip_provider.dart';

class PaySlipsScreen extends StatefulWidget {
  const PaySlipsScreen({super.key});

  @override
  State<PaySlipsScreen> createState() => _PaySlipsScreenState();
}

class _PaySlipsScreenState extends State<PaySlipsScreen> {
  int? _selectedYear;
  final _currencyFormat = NumberFormat.currency(locale: 'fr_FR', symbol: '€');

  @override
  void initState() {
    super.initState();
    _selectedYear = DateTime.now().year;
    context.read<PaySlipProvider>().loadPaySlips();
  }

  List<int> _getAvailableYears(List<PaySlipModel> payslips) {
    final years = payslips.map((p) => p.year).toSet().toList();
    years.sort((a, b) => b.compareTo(a));
    if (years.isEmpty) years.add(DateTime.now().year);
    return years;
  }

  void _showPayslipDetails(BuildContext context, PaySlipModel payslip) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _PaySlipDetailSheet(
        payslip: payslip,
        currencyFormat: _currencyFormat,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bulletins de paie')),
      body: Consumer<PaySlipProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final years = _getAvailableYears(provider.payslips);
          if (!years.contains(_selectedYear)) {
            _selectedYear = years.first;
          }

          final filtered = provider.payslips
              .where((p) => p.year == _selectedYear)
              .toList();

          return RefreshIndicator(
            onRefresh: provider.loadPaySlips,
            child: Column(
              children: [
                // Year filter
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      const Text(
                        'Année : ',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      DropdownButton<int>(
                        value: _selectedYear,
                        items: years
                            .map((y) => DropdownMenuItem(value: y, child: Text(y.toString())))
                            .toList(),
                        onChanged: (y) => setState(() => _selectedYear = y),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: filtered.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.description, size: 64, color: Colors.grey[400]),
                              const SizedBox(height: 16),
                              const Text('Aucun bulletin disponible'),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: filtered.length,
                          itemBuilder: (context, index) {
                            final payslip = filtered[index];
                            return _PaySlipCard(
                              payslip: payslip,
                              currencyFormat: _currencyFormat,
                              onTap: () => _showPayslipDetails(context, payslip),
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _PaySlipCard extends StatelessWidget {
  final PaySlipModel payslip;
  final NumberFormat currencyFormat;
  final VoidCallback onTap;

  const _PaySlipCard({
    required this.payslip,
    required this.currencyFormat,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.description_outlined, color: AppTheme.primaryColor),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      payslip.monthLabel,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Net : ${currencyFormat.format(payslip.netSalary)}',
                      style: const TextStyle(color: Color(0xFF424242)),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Color(0xFF9E9E9E)),
            ],
          ),
        ),
      ),
    );
  }
}

class _PaySlipDetailSheet extends StatefulWidget {
  final PaySlipModel payslip;
  final NumberFormat currencyFormat;

  const _PaySlipDetailSheet({required this.payslip, required this.currencyFormat});

  @override
  State<_PaySlipDetailSheet> createState() => _PaySlipDetailSheetState();
}

class _PaySlipDetailSheetState extends State<_PaySlipDetailSheet> {
  bool _isDownloading = false;

  Future<void> _download() async {
    setState(() => _isDownloading = true);
    try {
      await PaySlipRepository().downloadPaySlip(widget.payslip.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Bulletin téléchargé'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e.toString()}'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
    if (mounted) setState(() => _isDownloading = false);
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.payslip;
    final fmt = widget.currencyFormat;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            p.monthLabel,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 20),
          _DetailRow(label: 'Salaire brut', value: fmt.format(p.grossSalary), isHeader: true),
          const Divider(),
          _DetailRow(label: 'Cotisations salariales', value: '- ${fmt.format(p.employeeCharges)}'),
          _DetailRow(label: 'Salaire net', value: fmt.format(p.netSalary), isTotal: true),
          const Divider(),
          _DetailRow(label: 'Charges patronales', value: fmt.format(p.employerCharges)),
          const SizedBox(height: 24),
          SizedBox(
            height: 50,
            child: ElevatedButton.icon(
              onPressed: _isDownloading ? null : _download,
              icon: _isDownloading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Icon(Icons.download),
              label: const Text('Télécharger le bulletin'),
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isHeader;
  final bool isTotal;

  const _DetailRow({
    required this.label,
    required this.value,
    this.isHeader = false,
    this.isTotal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isHeader || isTotal ? 15 : 14,
              fontWeight: isHeader || isTotal ? FontWeight.bold : FontWeight.normal,
              color: isTotal ? AppTheme.primaryColor : const Color(0xFF424242),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isHeader || isTotal ? 15 : 14,
              fontWeight: isHeader || isTotal ? FontWeight.bold : FontWeight.normal,
              color: isTotal ? AppTheme.primaryColor : const Color(0xFF424242),
            ),
          ),
        ],
      ),
    );
  }
}
