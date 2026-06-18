import 'package:hr_mobile/core/constants/app_constants.dart';

class AbsenceModel {
  final String id;
  final String employeeId;
  final DateTime date;
  final String type;
  final bool justified;
  final String? comment;
  final DateTime createdAt;

  const AbsenceModel({
    required this.id,
    required this.employeeId,
    required this.date,
    required this.type,
    required this.justified,
    this.comment,
    required this.createdAt,
  });

  String get typeLabel => AppConstants.absenceTypeLabels[type] ?? type;

  factory AbsenceModel.fromJson(Map<String, dynamic> json) {
    return AbsenceModel(
      id: json['id']?.toString() ?? '',
      employeeId: json['employeeId']?.toString() ?? json['employee_id']?.toString() ?? '',
      date: DateTime.tryParse(json['date']?.toString() ?? '') ?? DateTime.now(),
      type: json['type'] ?? '',
      justified: json['justified'] == true || json['justified'] == 1,
      comment: json['comment'],
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      'date': date.toIso8601String(),
      'type': type,
      'justified': justified,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
