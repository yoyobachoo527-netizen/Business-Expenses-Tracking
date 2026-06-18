import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/presentation/providers/leave_provider.dart';
import 'package:hr_mobile/presentation/widgets/status_chip.dart';

class LeavesScreen extends StatefulWidget {
  const LeavesScreen({super.key});

  @override
  State<LeavesScreen> createState() => _LeavesScreenState();
}

class _LeavesScreenState extends State<LeavesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<String?> _filters = [null, 'pending', 'approved', 'rejected'];
  int _selectedTab = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _tabController.addListener(() {
      if (_tabController.indexIsChanging) {
        setState(() => _selectedTab = _tabController.index);
        context.read<LeaveProvider>().loadLeaves(statusFilter: _filters[_tabController.index]);
      }
    });
    context.read<LeaveProvider>().loadLeaves();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes congés'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: false,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'Toutes'),
            Tab(text: 'En attente'),
            Tab(text: 'Approuvées'),
            Tab(text: 'Refusées'),
          ],
        ),
      ),
      body: Consumer<LeaveProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.leaves.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.beach_access, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text(
                    'Aucune demande de congé',
                    style: TextStyle(fontSize: 16, color: Color(0xFF757575)),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton.icon(
                    onPressed: () => context.push('/leaves/new'),
                    icon: const Icon(Icons.add),
                    label: const Text('Nouvelle demande'),
                  ),
                ],
              ),
            );
          }

          final dateFormat = DateFormat('dd/MM/yyyy', 'fr_FR');

          return RefreshIndicator(
            onRefresh: () => provider.loadLeaves(statusFilter: _filters[_selectedTab]),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.leaves.length,
              itemBuilder: (context, index) {
                final leave = provider.leaves[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              leave.typeLabel,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: AppTheme.primaryColor,
                              ),
                            ),
                            StatusChip(status: leave.status),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 16, color: Color(0xFF757575)),
                            const SizedBox(width: 8),
                            Text(
                              '${dateFormat.format(leave.startDate)} → ${dateFormat.format(leave.endDate)}',
                              style: const TextStyle(color: Color(0xFF424242)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.schedule, size: 16, color: Color(0xFF757575)),
                            const SizedBox(width: 8),
                            Text(
                              '${leave.daysCount.toStringAsFixed(0)} jour(s)',
                              style: const TextStyle(color: Color(0xFF424242)),
                            ),
                          ],
                        ),
                        if (leave.reason != null && leave.reason!.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.info_outline, size: 16, color: Color(0xFF757575)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  leave.reason!,
                                  style: const TextStyle(color: Color(0xFF616161), fontSize: 13),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                        if (leave.isPending) ...[
                          const SizedBox(height: 12),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton.icon(
                              onPressed: () async {
                                final confirm = await showDialog<bool>(
                                  context: context,
                                  builder: (ctx) => AlertDialog(
                                    title: const Text('Annuler la demande'),
                                    content: const Text('Voulez-vous annuler cette demande de congé ?'),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(ctx, false),
                                        child: const Text('Non'),
                                      ),
                                      ElevatedButton(
                                        onPressed: () => Navigator.pop(ctx, true),
                                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.errorColor),
                                        child: const Text('Oui, annuler'),
                                      ),
                                    ],
                                  ),
                                );
                                if (confirm == true) {
                                  await provider.cancelLeave(leave.id);
                                }
                              },
                              icon: const Icon(Icons.cancel_outlined, color: AppTheme.errorColor),
                              label: const Text('Annuler', style: TextStyle(color: AppTheme.errorColor)),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/leaves/new'),
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Nouvelle demande', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
