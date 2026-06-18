import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hr_mobile/core/constants/app_constants.dart';
import 'package:hr_mobile/data/models/employee_model.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  Future<void> saveTokens(String access, String refresh) async {
    await Future.wait([
      _secureStorage.write(key: AppConstants.tokenKey, value: access),
      _secureStorage.write(key: AppConstants.refreshTokenKey, value: refresh),
    ]);
  }

  Future<String?> getAccessToken() async {
    return _secureStorage.read(key: AppConstants.tokenKey);
  }

  Future<String?> getRefreshToken() async {
    return _secureStorage.read(key: AppConstants.refreshTokenKey);
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _secureStorage.delete(key: AppConstants.tokenKey),
      _secureStorage.delete(key: AppConstants.refreshTokenKey),
    ]);
  }

  Future<void> saveEmployee(EmployeeModel employee) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.employeeKey, json.encode(employee.toJson()));
  }

  Future<EmployeeModel?> getEmployee() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(AppConstants.employeeKey);
    if (data == null) return null;
    try {
      return EmployeeModel.fromJson(json.decode(data));
    } catch (_) {
      return null;
    }
  }

  Future<void> clearAll() async {
    await clearTokens();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
