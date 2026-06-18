class EmployeeModel {
  final String id;
  final String matricule;
  final String firstName;
  final String lastName;
  final String email;
  final String department;
  final String position;
  final DateTime hireDate;

  const EmployeeModel({
    required this.id,
    required this.matricule,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.department,
    required this.position,
    required this.hireDate,
  });

  String get fullName => '$firstName $lastName';

  String get initials {
    final f = firstName.isNotEmpty ? firstName[0].toUpperCase() : '';
    final l = lastName.isNotEmpty ? lastName[0].toUpperCase() : '';
    return '$f$l';
  }

  factory EmployeeModel.fromJson(Map<String, dynamic> json) {
    return EmployeeModel(
      id: json['id']?.toString() ?? '',
      matricule: json['matricule']?.toString() ?? '',
      firstName: json['firstName'] ?? json['first_name'] ?? '',
      lastName: json['lastName'] ?? json['last_name'] ?? '',
      email: json['email'] ?? '',
      department: json['department'] ?? '',
      position: json['position'] ?? '',
      hireDate: json['hireDate'] != null
          ? DateTime.tryParse(json['hireDate'].toString()) ?? DateTime.now()
          : json['hire_date'] != null
              ? DateTime.tryParse(json['hire_date'].toString()) ?? DateTime.now()
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'matricule': matricule,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'department': department,
      'position': position,
      'hireDate': hireDate.toIso8601String(),
    };
  }
}
