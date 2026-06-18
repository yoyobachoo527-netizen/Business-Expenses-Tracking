import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:hr_mobile/core/constants/app_constants.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/presentation/providers/leave_provider.dart';

class LeaveRequestScreen extends StatefulWidget {
  const LeaveRequestScreen({super.key});

  @override
  State<LeaveRequestScreen> createState() => _LeaveRequestScreenState();
}

class _LeaveRequestScreenState extends State<LeaveRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedType;
  DateTime? _startDate;
  DateTime? _endDate;
  final _reasonController = TextEditingController();
  final _dateFormat = DateFormat('dd/MM/yyyy', 'fr_FR');

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  int get _daysCount {
    if (_startDate == null || _endDate == null) return 0;
    int count = 0;
    DateTime current = _startDate!;
    while (!current.isAfter(_endDate!)) {
      if (current.weekday != DateTime.saturday && current.weekday != DateTime.sunday) {
        count++;
      }
      current = current.add(const Duration(days: 1));
    }
    return count;
  }

  Future<void> _pickStartDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _startDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      locale: const Locale('fr', 'FR'),
    );
    if (date != null) {
      setState(() {
        _startDate = date;
        if (_endDate != null && _endDate!.isBefore(date)) {
          _endDate = date;
        }
      });
    }
  }

  Future<void> _pickEndDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _endDate ?? _startDate ?? DateTime.now(),
      firstDate: _startDate ?? DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      locale: const Locale('fr', 'FR'),
    );
    if (date != null) {
      setState(() => _endDate = date);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_startDate == null || _endDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez sélectionner les dates')),
      );
      return;
    }

    final success = await context.read<LeaveProvider>().createLeave({
      'type': _selectedType,
      'startDate': _startDate!.toIso8601String(),
      'endDate': _endDate!.toIso8601String(),
      'reason': _reasonController.text.trim(),
    });

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Demande de congé soumise avec succès'),
            backgroundColor: AppTheme.successColor,
          ),
        );
        context.pop();
      } else {
        final error = context.read<LeaveProvider>().error;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error ?? 'Erreur lors de la soumission'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nouvelle demande de congé')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Type de congé',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedType,
                        decoration: const InputDecoration(
                          hintText: 'Sélectionner un type',
                        ),
                        items: AppConstants.leaveTypeLabels.entries
                            .map((e) => DropdownMenuItem(value: e.key, child: Text(e.value)))
                            .toList(),
                        onChanged: (value) => setState(() => _selectedType = value),
                        validator: (value) => value == null ? 'Veuillez sélectionner un type' : null,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Dates',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: _pickStartDate,
                              child: InputDecorator(
                                decoration: const InputDecoration(
                                  labelText: 'Date de début',
                                  prefixIcon: Icon(Icons.calendar_today),
                                ),
                                child: Text(
                                  _startDate != null ? _dateFormat.format(_startDate!) : 'Choisir',
                                  style: TextStyle(
                                    color: _startDate != null ? const Color(0xFF212121) : const Color(0xFFBDBDBD),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: InkWell(
                              onTap: _pickEndDate,
                              child: InputDecorator(
                                decoration: const InputDecoration(
                                  labelText: 'Date de fin',
                                  prefixIcon: Icon(Icons.calendar_today),
                                ),
                                child: Text(
                                  _endDate != null ? _dateFormat.format(_endDate!) : 'Choisir',
                                  style: TextStyle(
                                    color: _endDate != null ? const Color(0xFF212121) : const Color(0xFFBDBDBD),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      if (_startDate != null && _endDate != null) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.secondaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.info_outline, color: AppTheme.secondaryColor, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                '$_daysCount jour(s) ouvré(s)',
                                style: const TextStyle(
                                  color: AppTheme.secondaryColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Motif (optionnel)',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _reasonController,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          hintText: 'Saisissez un motif...',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Consumer<LeaveProvider>(
                builder: (context, provider, _) {
                  return SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      onPressed: provider.isLoading ? null : _submit,
                      child: provider.isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Text('Soumettre la demande'),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
