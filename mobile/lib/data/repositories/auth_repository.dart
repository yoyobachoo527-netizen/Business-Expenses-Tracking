import 'package:hr_mobile/data/models/employee_model.dart';
import 'package:hr_mobile/data/services/api_service.dart';
import 'package:hr_mobile/data/services/storage_service.dart';

class AuthRepository {
  final ApiService _api = ApiService();
  final StorageService _storage = StorageService();

  Future<EmployeeModel> login(String email, String password) async {
    final data = await _api.post('/auth/login', {
      'email': email,
      'password': password,
    });

    final accessToken = data['accessToken'] ?? data['access_token'] ?? '';
    final refreshToken = data['refreshToken'] ?? data['refresh_token'] ?? '';

    await _storage.saveTokens(accessToken, refreshToken);

    final employeeData = data['employee'] ?? data['user'] ?? data;
    final employee = EmployeeModel.fromJson(employeeData);
    await _storage.saveEmployee(employee);

    return employee;
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout', {});
    } catch (_) {}
    await _storage.clearAll();
  }

  Future<void> refreshToken() async {
    final refresh = await _storage.getRefreshToken();
    if (refresh == null) throw Exception('No refresh token');

    final data = await _api.post('/auth/refresh', {'refreshToken': refresh});

    final accessToken = data['accessToken'] ?? data['access_token'] ?? '';
    final newRefresh = data['refreshToken'] ?? data['refresh_token'] ?? refresh;
    await _storage.saveTokens(accessToken, newRefresh);
  }

  Future<EmployeeModel> getCurrentEmployee() async {
    final data = await _api.get('/employees/me');
    final employee = EmployeeModel.fromJson(data);
    await _storage.saveEmployee(employee);
    return employee;
  }
}
