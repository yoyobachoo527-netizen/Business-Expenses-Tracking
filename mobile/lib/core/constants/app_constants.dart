class AppConstants {
  static const String apiBaseUrl = 'http://localhost:3000/api';
  static const String tokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String employeeKey = 'employee_data';

  static const Map<String, String> leaveTypeLabels = {
    'conges_payes': 'Congés payés',
    'rtt': 'RTT',
    'maladie': 'Maladie',
    'sans_solde': 'Sans solde',
    'maternite': 'Maternité',
    'paternite': 'Paternité',
  };

  static const Map<String, String> absenceTypeLabels = {
    'maladie': 'Maladie',
    'accident_travail': 'Accident du travail',
    'evenement_familial': 'Événement familial',
    'autre': 'Autre',
  };

  static const Map<String, String> statusLabels = {
    'pending': 'En attente',
    'approved': 'Approuvée',
    'rejected': 'Refusée',
    'cancelled': 'Annulée',
  };
}
