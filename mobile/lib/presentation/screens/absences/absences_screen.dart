import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:hr_mobile/core/constants/app_constants.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/data/models/absence_model.dart';
import 'package:hr_mobile/presentation/providers/absence_provider.dart';

class AbsencesScreen extends StatefulWidget {
  const AbsencesScreen({super.key});

  @override
  State<AbsencesScreen> createState() => _AbsencesScreenState();
}

class _AbsencesScreenState extends State<AbsencesScreen> {
  bool? _justifiedFilter;
  final _dateFormat = DateFormat('dd/MM/yyyy', 'fr_FR');

  @override
  void initState() {
    super.initState();
    context.read<AbsenceProvider>().loadAbsences();
  }

  void _showDeclareBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _DeclareAbsenceSheet(
        onSubmit: (data) async {
          final success = await context.read<AbsenceProvider>().declareAbsence(data);
          if (context.mounted) {
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(success ? 'Absence déclarée' : (context.read<AbsenceProvider>().error ?? 'Erreur')),
                backgroundColor: success ? AppTheme.successColor : AppTheme.errorColor,
              ),
            );
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mes absences')),
      body: Column(
        children: [
          // Filter chips
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                FilterChip(
                  label: const Text('Toutes'),
                  selected: _justifiedFilter == null,
                  onSelected: (_) {
                    setState(() => _justifiedFilter = null);
                    context.read<AbsenceProvider>().loadAbsences();
                  },
                ),
                const SizedBox(width: 8),
                FilterChip(
                  label: const Text('Justifiées'),
                  selected: _justifiedFilter == true,
                  onSelected: (_) {
                    setState(() => _justifiedFilter = true);
                    context.read<AbsenceProvider>().loadAbsences(justified: true);
                  },
                ),
                const SizedBox(width: 8),
                FilterChip(
                  label: const Text('Non justifiées'),
                  selected: _justifiedFilter == false,
                  onSelected: (_) {
                    setState(() => _justifiedFilter = false);
                    context.read<AbsenceProvider>().loadAbsences(justified: false);
                  },
                ),
              ],
            ),
          ),
          Expanded(
            child: Consumer<AbsenceProvider>(
              builder: (context, provider, _) {
                if (provider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (provider.absences.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.event_busy, size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        const Text('Aucune absence enregistrée'),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => provider.loadAbsences(justified: _justifiedFilter),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: provider.absences.length,
                    itemBuilder: (context, index) {
                      final absence = provider.absences[index];
                      return _AbsenceCard(absence: absence, dateFormat: _dateFormat);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showDeclareBottomSheet,
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Déclarer', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}

class _AbsenceCard extends StatelessWidget {
  final AbsenceModel absence;
  final DateFormat dateFormat;

  const _AbsenceCard({required this.absence, required this.dateFormat});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: absence.justified
                    ? AppTheme.successColor.withOpacity(0.1)
                    : AppTheme.errorColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                absence.justified ? Icons.check_circle_outline : Icons.warning_amber_outlined,
                color: absence.justified ? AppTheme.successColor : AppTheme.errorColor,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    absence.typeLabel,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    dateFormat.format(absence.date),
                    style: const TextStyle(color: Color(0xFF757575)),
                  ),
                  if (absence.comment != null && absence.comment!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      absence.comment!,
                      style: const TextStyle(color: Color(0xFF9E9E9E), fontSize: 13),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: absence.justified
                    ? AppTheme.successColor.withOpacity(0.1)
                    : AppTheme.errorColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                absence.justified ? 'Justifiée' : 'Non just.',
                style: TextStyle(
                  fontSize: 12,
                  color: absence.justified ? AppTheme.successColor : AppTheme.errorColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DeclareAbsenceSheet extends StatefulWidget {
  final Future<void> Function(Map<String, dynamic>) onSubmit;

  const _DeclareAbsenceSheet({required this.onSubmit});

  @override
  State<_DeclareAbsenceSheet> createState() => _DeclareAbsenceSheetState();
}

class _DeclareAbsenceSheetState extends State<_DeclareAbsenceSheet> {
  final _formKey = GlobalKey<FormState>();
  DateTime? _date;
  String? _type;
  final _commentController = TextEditingController();
  bool _isLoading = false;
  final _dateFormat = DateFormat('dd/MM/yyyy', 'fr_FR');

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 90)),
      lastDate: DateTime.now(),
      locale: const Locale('fr', 'FR'),
    );
    if (date != null) setState(() => _date = date);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_date == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez sélectionner une date')),
      );
      return;
    }

    setState(() => _isLoading = true);
    await widget.onSubmit({
      'date': _date!.toIso8601String(),
      'type': _type,
      'comment': _commentController.text.trim(),
    });
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Déclarer une absence',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
            ),
            const SizedBox(height: 20),
            InkWell(
              onTap: _pickDate,
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Date de l\'absence',
                  prefixIcon: Icon(Icons.calendar_today),
                ),
                child: Text(
                  _date != null ? _dateFormat.format(_date!) : 'Sélectionner une date',
                  style: TextStyle(color: _date != null ? const Color(0xFF212121) : const Color(0xFFBDBDBD)),
                ),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _type,
              decoration: const InputDecoration(hintText: 'Type d\'absence'),
              items: AppConstants.absenceTypeLabels.entries
                  .map((e) => DropdownMenuItem(value: e.key, child: Text(e.value)))
                  .toList(),
              onChanged: (v) => setState(() => _type = v),
              validator: (v) => v == null ? 'Veuillez sélectionner un type' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _commentController,
              maxLines: 2,
              decoration: const InputDecoration(hintText: 'Commentaire (optionnel)'),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 50,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text('Déclarer l\'absence'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
