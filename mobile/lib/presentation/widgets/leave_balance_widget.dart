import 'package:flutter/material.dart';
import '../../data/models/leave_balance_model.dart';

class LeaveBalanceWidget extends StatelessWidget {
  final LeaveBalanceModel balance;

  const LeaveBalanceWidget({super.key, required this.balance});

  @override
  Widget build(BuildContext context) {
    final color = _getColor(balance.percentUsed);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            balance.typeLabel,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Color(0xFF616161),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${balance.remaining.toStringAsFixed(0)}j',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                '/ ${balance.total.toStringAsFixed(0)}j',
                style: const TextStyle(fontSize: 12, color: Color(0xFF9E9E9E)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: balance.percentUsed.clamp(0.0, 1.0),
              backgroundColor: color.withOpacity(0.15),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Color _getColor(double percentUsed) {
    if (percentUsed < 0.5) return Colors.green.shade600;
    if (percentUsed < 0.8) return Colors.orange.shade600;
    return Colors.red.shade600;
  }
}
