import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';

class StatusChip extends StatelessWidget {
  final String status;

  const StatusChip({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final config = _getConfig(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: config.$1.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: config.$1.withOpacity(0.4)),
      ),
      child: Text(
        AppConstants.statusLabels[status] ?? status,
        style: TextStyle(
          color: config.$1,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  (Color, IconData) _getConfig(String status) {
    switch (status) {
      case 'approved':
        return (Colors.green.shade700, Icons.check_circle);
      case 'rejected':
        return (Colors.red.shade700, Icons.cancel);
      case 'cancelled':
        return (Colors.grey.shade600, Icons.block);
      default:
        return (Colors.orange.shade700, Icons.schedule);
    }
  }
}
