import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [statsRange, setStatsRange] = useState('all');
  const [reportModal, setReportModal] = useState(null);
  const [reportForm, setReportForm] = useState({ handledBy: '', notes: '' });
  const [savingReport, setSavingReport] = useState(false);


  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('İhbarlar getirilemedi:', error);
      if (error.response?.status !== 401) {
        toast.error('İhbarlar yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!newStatus) return;
    setUpdatingId(id);
    try {
      const response = await api.patch(`/reports/${id}/status`, { status: newStatus });
      const updated = response.data;
      toast.success(`Durum güncellendi: ${updated.status}`);

      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, status: updated.status } : report
        )
      );
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      const message =
        error.response?.data?.message || 'Durum güncellenirken bir hata oluştu';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/admin/login');
  };

  const openReportModal = (report) => {
    setReportModal(report);
    setReportForm({
      handledBy: report.handledBy || '',
      notes: report.notes || ''
    });
  };

  const closeReportModal = () => {
    setReportModal(null);
    setReportForm({ handledBy: '', notes: '' });
  };

  const handleSaveReport = async () => {
    if (!reportModal) return;
    setSavingReport(true);
    try {
      const response = await api.patch(`/reports/${reportModal.id}/report-info`, {
        handledBy: reportForm.handledBy.trim(),
        notes: reportForm.notes.trim()
      });
      const updated = response.data;
      setReports((prev) =>
      prev.map((r) =>
        r.id === updated.id
          ? {
              ...r,
              handledBy: updated.handledBy,
              notes: updated.notes,
              updatedAt: updated.updatedAt
            }
          : r
      )
    );
      toast.success('Rapor kaydedildi');
      closeReportModal();
    } catch (error) {
      console.error('Rapor kaydetme hatası:', error);
      const message = error.response?.data?.message || 'Rapor kaydedilemedi';
      toast.error(message);
    } finally {
      setSavingReport(false);
    }
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 
  const filteredReports = reports.filter((report) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return report.status === 'Bekliyor';
    if (filter === 'resolved') return report.status === 'Çözüldü';
    return true;
  });

  
  const getStatsRangeBounds = () => {
    const now = new Date();
    if (statsRange === 'week') {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return { start, end };
    }
    if (statsRange === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      return { start, end };
    }
    return null;
  };

  const statsRangeBounds = getStatsRangeBounds();

  const statsScopedReports = statsRangeBounds
    ? reports.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= statsRangeBounds.start && d < statsRangeBounds.end;
      })
    : reports;

  const stats = {
    total: statsScopedReports.length,
    pending: statsScopedReports.filter((r) => r.status === 'Bekliyor').length,
    resolved: statsScopedReports.filter((r) => r.status === 'Çözüldü').length
  };

  const totalCounts = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Bekliyor').length,
    resolved: reports.filter((r) => r.status === 'Çözüldü').length
  };

  const statsRangeLabel =
    statsRange === 'week'
      ? 'Bu Hafta (Pzt - Paz)'
      : statsRange === 'month'
      ? 'Bu Ay'
      : 'Tüm Zamanlar';

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
  <div className="header-content">
    <div>
      <h1>Yetkili Paneli</h1>
      <p className="welcome">Hoş geldiniz, {user?.fullName || user?.username}</p>
    </div>
    <div className="header-actions">
      {isAdmin && (
        <button
          onClick={() => navigate('/admin/users')}
          className="nav-btn"
        >
          Personel Yönetimi
        </button>
      )}
      <button onClick={handleLogout} className="logout-btn">
        Çıkış Yap
      </button>
    </div>
  </div>
</header>

      <main className="dashboard-main">
        <div className="stats-header">
          <span className="stats-range-label">{statsRangeLabel}</span>
          <select
            className="stats-range-select"
            value={statsRange}
            onChange={(e) => setStatsRange(e.target.value)}
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="week">Haftalık</option>
            <option value="month">Aylık</option>
          </select>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Toplam İhbar</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-label">Bekleyen</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-card resolved">
            <span className="stat-label">Çözülen</span>
            <span className="stat-value">{stats.resolved}</span>
          </div>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tümü ({totalCounts.total})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Bekleyen ({totalCounts.pending})
          </button>
          <button
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Çözülen ({totalCounts.resolved})
          </button>
          <button onClick={fetchReports} className="refresh-btn">
            ↻ Yenile
          </button>
        </div>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>Bu kategoride ihbar bulunmuyor.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Başlık</th>
                  <th>Açıklama</th>
                  <th>İlçe</th>
                  <th>Tarih</th>
                  <th>Bildirim Zamanı</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                  <th>Rapor</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td className="title-cell">{report.title}</td>
                    <td className="description-cell" title={report.description}>
                      {report.description.length > 60
                        ? report.description.substring(0, 60) + '...'
                        : report.description}
                    </td>
                    <td>{report.district}</td>
                    <td>{formatDate(report.reportDate)}</td>
                    <td>{formatDateTime(report.createdAt)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          report.status === 'Bekliyor'
                            ? 'pending'
                            : report.status === 'Çözüldü'
                            ? 'resolved'
                            : report.status === 'İşlemde'
                            ? 'inprogress'
                            : 'cancelled'
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value=""
                        disabled={updatingId === report.id}
                        onChange={(e) => {
                          const action = e.target.value;
                          if (!action) return;
                          const map = {
                            tamamlandi: 'Çözüldü',
                            iptal: 'İptal',
                            islemde: 'İşlemde'
                          };
                          handleStatusChange(report.id, map[action]);
                          e.target.value = '';
                        }}
                      >
                        <option value="">
                          {updatingId === report.id ? 'İşleniyor...' : 'İşlem Seç'}
                        </option>
                        <option value="tamamlandi">Tamamlandı</option>
                        <option value="islemde">İşlemde</option>
                        <option value="iptal">İptal</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={`report-icon-btn ${report.handledBy || report.notes ? 'has-data' : ''}`}
                        onClick={() => openReportModal(report)}
                        title="Rapor görüntüle/düzenle"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {reportModal && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Rapor #{reportModal.id}</h2>
              <button className="modal-close" onClick={closeReportModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <strong>Başlık:</strong> {reportModal.title}
              </div>
              <div className="modal-info">
                <strong>İlçe:</strong> {reportModal.district}
              </div>
              <div className="modal-info">
                <strong>Durum:</strong> {reportModal.status}
              </div>
              {reportModal.updatedAt && (
                <div className="modal-info">
                  <strong>Son Güncelleme:</strong>{' '}
                  {formatDateTime(reportModal.updatedAt)}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="handledBy">Kim İlgilendi</label>
                <input
                  type="text"
                  id="handledBy"
                  value={reportForm.handledBy}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, handledBy: e.target.value })
                  }
                  placeholder="İlgilenen yetkili adı"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Açıklamalar</label>
                <textarea
                  id="notes"
                  value={reportForm.notes}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, notes: e.target.value })
                  }
                  placeholder="Yapılan işlemler, notlar..."
                  rows={5}
                  maxLength={2000}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={closeReportModal}
                disabled={savingReport}
              >
                İptal
              </button>
              <button
                className="modal-btn modal-btn-save"
                onClick={handleSaveReport}
                disabled={savingReport}
              >
                {savingReport ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;