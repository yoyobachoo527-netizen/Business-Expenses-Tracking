import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/presentation/providers/auth_provider.dart';
import 'package:hr_mobile/presentation/providers/leave_provider.dart';
import 'package:hr_mobile/presentation/widgets/leave_balance_widget.dart';
import 'package:hr_mobile/presentation/widgets/status_chip.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LeaveProvider>().loadLeaves();
      context.read<LeaveProvider>().loadBalances();
    });
  }

  void _onNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        break;
      case 1:
        context.push('/leaves');
        break;
      case 2:
        context.push('/absences');
        break;
      case 3:
        context.push('/payslips');
        break;
    }
  }

  Future<void> _refresh() async {
    await context.read<LeaveProvider>().loadLeaves();
    await context.read<LeaveProvider>().loadBalances();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final employee = authProvider.employee;
    final todayFormatted = DateFormat('EEEE d MMMM yyyy', 'fr_FR').format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Espace RH'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header card
              Card(
                color: AppTheme.primaryColor,
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        child: Text(
                          employee?.initials ?? 'ME',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Bonjour, ${employee?.firstName ?? ''}!',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              todayFormatted,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 13,
                              ),
                            ),
                            if (employee?.position != null) ...[
                              const SizedBox(height: 2),
                              Text(
                                employee!.position,
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.7),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Leave balances
              const Text(
                'Soldes de congés',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              Consumer<LeaveProvider>(
                builder: (context, leaveProvider, _) {
                  final balances = leaveProvider.balances
                      .where((b) => ['conges_payes', 'rtt', 'maladie'].contains(b.type))
                      .take(3)
                      .toList();

                  if (balances.isEmpty) {
                    return const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Center(child: Text('Aucun solde disponible')),
                      ),
                    );
                  }

                  return Row(
                    children: balances
                        .map((b) => Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: LeaveBalanceWidget(balance: b),
                              ),
                            ))
                        .toList(),
                  );
                },
              ),
              const SizedBox(height: 20),
              // Quick access
              const Text(
                'Accès rapide',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _QuickAccessButton(
                    icon: Icons.add_circle_outline,
                    label: 'Demander\nun congé',
                    onTap: () => context.push('/leaves/new'),
                  ),
                  _QuickAccessButton(
                    icon: Icons.event_busy,
                    label: 'Déclarer\nune absence',
                    onTap: () => context.push('/absences'),
                  ),
                  _QuickAccessButton(
                    icon: Icons.description_outlined,
                    label: 'Mes\nbulletins',
                    onTap: () => context.push('/payslips'),
                  ),
                  _QuickAccessButton(
                    icon: Icons.list_alt,
                    label: 'Mes\ncongés',
                    onTap: () => context.push('/leaves'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Recent leaves
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Dernières demandes',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/leaves'),
                    child: const Text('Voir tout'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Consumer<LeaveProvider>(
                builder: (context, leaveProvider, _) {
                  if (leaveProvider.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  final recentLeaves = leaveProvider.leaves.take(3).toList();

                  if (recentLeaves.isEmpty) {
                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Icon(Icons.beach_access, size: 48, color: Colors.grey[400]),
                            const SizedBox(height: 8),
                            const Text('Aucune demande de congé'),
                          ],
                        ),
                      ),
                    );
                  }

                  return Column(
                    children: recentLeaves.map((leave) {
                      final dateFormat = DateFormat('dd/MM/yyyy', 'fr_FR');
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          leading: const Icon(Icons.event_outlined, color: AppTheme.primaryColor),
                          title: Text(leave.typeLabel),
                          subtitle: Text(
                            '${dateFormat.format(leave.startDate)} - ${dateFormat.format(leave.endDate)} (${leave.daysCount.toStringAsFixed(0)} j)',
                          ),
                          trailing: StatusChip(status: leave.status),
                        ),
                      );
                    }).toList(),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.beach_access_outlined),
            activeIcon: Icon(Icons.beach_access),
            label: 'Congés',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event_busy_outlined),
            activeIcon: Icon(Icons.event_busy),
            label: 'Absences',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description_outlined),
            activeIcon: Icon(Icons.description),
            label: 'Bulletins',
          ),
        ],
      ),
    );
  }
}

class _QuickAccessButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAccessButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.primaryColor, size: 28),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontSize: 11, color: Color(0xFF424242)),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
