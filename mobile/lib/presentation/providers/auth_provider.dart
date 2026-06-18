import 'package:flutter/foundation.dart';
import 'package:hr_mobile/data/models/employee_model.dart';
import 'package:hr_mobile/data/repositories/auth_repository.dart';
import 'package:hr_mobile/data/services/storage_service.dart';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  final AuthRepository _repository = AuthRepository();
  final StorageService _storage = StorageService();

  AuthStatus _status = AuthStatus.initial;
  EmployeeModel? _employee;
  String? _errorMessage;

  AuthStatus get status => _status;
  EmployeeModel? get employee => _employee;
  String? get errorMessage => _errorMessage;

  bool get isAuthenticated => _status == AuthStatus.authenticated;

  Future<void> checkAuthStatus() async {
    _status = AuthStatus.loading;
    notifyListeners();

    try {
      final token = await _storage.getAccessToken();
      if (token == null) {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        return;
      }

      final cachedEmployee = await _storage.getEmployee();
      if (cachedEmployee != null) {
        _employee = cachedEmployee;
        _status = AuthStatus.authenticated;
        notifyListeners();
      }

      try {
        _employee = await _repository.getCurrentEmployee();
        _status = AuthStatus.authenticated;
      } catch (_) {
        if (cachedEmployee == null) {
          _status = AuthStatus.unauthenticated;
        }
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      _employee = await _repository.login(email, password);
      _status = AuthStatus.authenticated;
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceAll('ApiException', '').replaceAll('Exception:', '').trim();
    }
    notifyListeners();
  }

  Future<void> logout() async {
    await _repository.logout();
    _employee = null;
    _status = AuthStatus.unauthenticated;
    _errorMessage = null;
    notifyListeners();
  }
}
