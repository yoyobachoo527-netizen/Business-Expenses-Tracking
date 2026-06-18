import 'package:intl/intl.dart';

class PaySlipModel {
  final String id;
  final int month;
  final int year;
  final double grossSalary;
  final double netSalary;
  final double employerCharges;
  final double employeeCharges;
  final String? pdfPath;

  const PaySlipModel({
    required this.id,
    required this.month,
    required this.year,
    required this.grossSalary,
    required this.netSalary,
    required this.employerCharges,
    required this.employeeCharges,
    this.pdfPath,
  });

  String get monthLabel {
    final date = DateTime(year, month, 1);
    return DateFormat('MMMM yyyy', 'fr_FR').format(date);
  }

  factory PaySlipModel.fromJson(Map<String, dynamic> json) {
    return PaySlipModel(
      id: json['id']?.toString() ?? '',
      month: (json['month'] ?? 1) as int,
      year: (json['year'] ?? DateTime.now().year) as int,
      grossSalary: (json['grossSalary'] ?? json['gross_salary'] ?? 0).toDouble(),
      netSalary: (json['netSalary'] ?? json['net_salary'] ?? 0).toDouble(),
      employerCharges: (json['employerCharges'] ?? json['employer_charges'] ?? 0).toDouble(),
      employeeCharges: (json['employeeCharges'] ?? json['employee_charges'] ?? 0).toDouble(),
      pdfPath: json['pdfPath'] ?? json['pdf_path'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'month': month,
      'year': year,
      'grossSalary': grossSalary,
      'netSalary': netSalary,
      'employerCharges': employerCharges,
      'employeeCharges': employeeCharges,
      'pdfPath': pdfPath,
    };
  }
}
