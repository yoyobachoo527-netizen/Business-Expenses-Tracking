import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hr_mobile/core/constants/app_constants.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException({required this.statusCode, required this.message});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final String _baseUrl = AppConstants.apiBaseUrl;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> _handleResponse(http.Response response, {bool isRetry = false}) async {
    if (response.statusCode == 401 && !isRetry) {
      final refreshed = await _tryRefreshToken();
      if (refreshed) {
        throw const _RetryException();
      }
      throw ApiException(statusCode: 401, message: 'Non autorisé');
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    }

    String message = 'Une erreur est survenue';
    try {
      final body = json.decode(response.body);
      message = body['message'] ?? body['error'] ?? message;
    } catch (_) {}

    throw ApiException(statusCode: response.statusCode, message: message);
  }

  Future<bool> _tryRefreshToken() async {
    try {
      final refreshToken = await _storage.read(key: AppConstants.refreshTokenKey);
      if (refreshToken == null) return false;

      final response = await http.post(
        Uri.parse('$_baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        await _storage.write(key: AppConstants.tokenKey, value: data['accessToken']);
        if (data['refreshToken'] != null) {
          await _storage.write(key: AppConstants.refreshTokenKey, value: data['refreshToken']);
        }
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<dynamic> get(String path) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(Uri.parse('$_baseUrl$path'), headers: headers);
      return _handleResponse(response);
    } on _RetryException {
      final headers = await _getHeaders();
      final response = await http.get(Uri.parse('$_baseUrl$path'), headers: headers);
      return _handleResponse(response, isRetry: true);
    }
  }

  Future<dynamic> post(String path, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$_baseUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return _handleResponse(response);
    } on _RetryException {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$_baseUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return _handleResponse(response, isRetry: true);
    }
  }

  Future<dynamic> put(String path, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final response = await http.put(
        Uri.parse('$_baseUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return _handleResponse(response);
    } on _RetryException {
      final headers = await _getHeaders();
      final response = await http.put(
        Uri.parse('$_baseUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return _handleResponse(response, isRetry: true);
    }
  }

  Future<dynamic> delete(String path) async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(Uri.parse('$_baseUrl$path'), headers: headers);
      return _handleResponse(response);
    } on _RetryException {
      final headers = await _getHeaders();
      final response = await http.delete(Uri.parse('$_baseUrl$path'), headers: headers);
      return _handleResponse(response, isRetry: true);
    }
  }

  Future<Uint8List> downloadFile(String path) async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl$path'), headers: headers);
    if (response.statusCode == 200) {
      return response.bodyBytes;
    }
    throw ApiException(statusCode: response.statusCode, message: 'Erreur lors du téléchargement');
  }
}

class _RetryException implements Exception {
  const _RetryException();
}
