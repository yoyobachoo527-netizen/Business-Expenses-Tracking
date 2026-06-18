import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/payslip_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/payslip_model.dart';
import '../../../data/repositories/payslip_repository.dart';

class PaySlipsScreen extends StatefulWidget {
  const PaySlipsScreen({super.key});

  @override
  State<PaySlipsScreen> createState() => _PaySlipsScreenState();
}

class _PaySlipsScreenState extends State<PaySlipsScreen> {
  int? _selectedYear;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PaySlipProvider>().loadPaySlips();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes bulletins de paie'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/dashboard'),
        ),
      ),
      body: Consumer<PaySlipProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final years = provider.payslips
              .map((p) => p.year)
              .toSet()
              .toList()
            ..sort((a, b) => b.compareTo(a));

          final filtered = _selectedYear == null
              ? provider.payslips
              : provider.payslips
                  .where((p) => p.year == _selectedYear)
                  .toList();

          if (provider.payslips.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.description, size: 64, color: Colors.grey.shade300),
                  const SizedBox(height: 16),
                  Text('Aucun bulletin disponible',
                      style: TextStyle(
                          color: Colors.grey.shade500, fontSize: 16)),
                ],
              ),
            );
          }

          return Column(
            children: [
              if (years.length > 1)
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      const Text('Année :',
                          style: TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(width: 12),
                      ...([null, ...years]).map((y) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: GestureDetector(
                              onTap: () =>
                                  setState(() => _selectedYear = y),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: _selectedYear == y
                                      ? AppTheme.primaryColor
                                      : Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  y?.toString() ?? 'Toutes',
                                  style: TextStyle(
                                    color: _selectedYear == y
                                        ? Colors.white
                                        : Colors.grey.shade700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          )),
                    ],
                  ),
                ),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () => provider.loadPaySlips(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, i) =>
                        _PaySlipCard(payslip: filtered[i]),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _PaySlipCard extends StatelessWidget {
  final PaySlipModel payslip;
  const _PaySlipCard({required this.payslip});

  void _showDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _PaySlipDetailSheet(payslip: payslip),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: () => _showDetails(context),
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
                child: const Icon(Icons.description,
                    color: AppTheme.primaryColor),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      payslip.monthLabel,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 15),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Net : ${payslip.formattedNet}',
                      style: TextStyle(
                          fontSize: 13, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.download_outlined,
                    color: AppTheme.primaryColor),
                onPressed: () => _downloadPdf(context),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _downloadPdf(BuildContext context) async {
    try {
      await PaySlipRepository().downloadPaySlip(payslip.id);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Bulletin téléchargé'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erreur lors du téléchargement'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}

class _PaySlipDetailSheet extends StatelessWidget {
  final PaySlipModel payslip;
  const _PaySlipDetailSheet({required this.payslip});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(payslip.monthLabel,
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold)),
              IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context)),
            ],
          ),
          const Divider(),
          _DetailRow('Salaire brut', payslip.formattedGross),
          _DetailRow('Charges salariales',
              '- ${payslip.formattedNet}', isNegative: true),
          _DetailRow('Charges patronales',
              payslip.formattedNet),
          const Divider(),
          _DetailRow('Salaire net', payslip.formattedNet,
              isBold: true, color: AppTheme.primaryColor),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.download),
            label: const Text('Télécharger le bulletin PDF'),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;
  final bool isNegative;
  final Color? color;

  const _DetailRow(this.label, this.value,
      {this.isBold = false, this.isNegative = false, this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                  fontWeight:
                      isBold ? FontWeight.bold : FontWeight.normal,
                  fontSize: 14,
                  color: Colors.grey.shade700)),
          Text(value,
              style: TextStyle(
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                fontSize: 14,
                color: color ??
                    (isNegative ? Colors.red.shade600 : Colors.black87),
              )),
        ],
      ),
    );
  }
}
