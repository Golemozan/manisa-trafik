import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function UserManagement() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Yeni kullanıcı modalı
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'Personnel'
  });
  const [createErrors, setCreateErrors] = useState({});
  const [creating, setCreating] = useState(false);

  // Şifre sıfırlama modalı
  const [passwordModal, setPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar getirilemedi:', error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/admin/login');
  };

  // --- YENİ KULLANICI ---
  const openCreateModal = () => {
    setCreateForm({ username: '', password: '', fullName: '', role: 'Personnel' });
    setCreateErrors({});
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setCreateErrors({});
  };

  const validateCreate = () => {
    const errors = {};
    if (!createForm.username.trim()) {
      errors.username = 'Kullanıcı adı zorunludur';
    } else if (createForm.username.trim().length < 3) {
      errors.username = 'Kullanıcı adı en az 3 karakter olmalı';
    }
    if (!createForm.password) {
      errors.password = 'Şifre zorunludur';
    } else if (createForm.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalı';
    }
    if (!createForm.fullName.trim()) {
      errors.fullName = 'Ad Soyad zorunludur';
    } else if (createForm.fullName.trim().length < 2) {
      errors.fullName = 'Ad Soyad en az 2 karakter olmalı';
    }
    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateCreate()) return;

    setCreating(true);
    try {
      const response = await api.post('/users', {
        username: createForm.username.trim(),
        password: createForm.password,
        fullName: createForm.fullName.trim(),
        role: createForm.role
      });

      setUsers((prev) => [response.data, ...prev]);
      toast.success('Kullanıcı oluşturuldu');
      closeCreateModal();
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      const message =
        error.response?.data?.message || 'Kullanıcı oluşturulurken hata oluştu';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // --- AKTİF/PASİF ---
  const handleToggleActive = async (id) => {
    setActionId(id);
    try {
      const response = await api.patch(`/users/${id}/toggle-active`);
      const updated = response.data;
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: updated.isActive } : u))
      );
      toast.success(
        updated.isActive ? 'Kullanıcı aktifleştirildi' : 'Kullanıcı pasifleştirildi'
      );
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
      const message =
        error.response?.data?.message || 'Durum değiştirilemedi';
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  // --- ŞİFRE SIFIRLA ---
  const openPasswordModal = (user) => {
    setPasswordModal(user);
    setNewPassword('');
    setPasswordError('');
  };

  const closePasswordModal = () => {
    setPasswordModal(null);
    setNewPassword('');
    setPasswordError('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setPasswordError('Yeni şifre zorunludur');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalı');
      return;
    }

    setResettingPassword(true);
    try {
      await api.patch(`/users/${passwordModal.id}/password`, {
        newPassword: newPassword
      });
      toast.success('Şifre güncellendi');
      closePasswordModal();
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      const message =
        error.response?.data?.message || 'Şifre güncellenemedi';
      toast.error(message);
    } finally {
      setResettingPassword(false);
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Personel Yönetimi</h1>
            <p className="welcome">Hoş geldiniz, {user?.fullName || user?.username}</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="nav-btn"
            >
              İhbarlar
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="page-actions">
          <button onClick={openCreateModal} className="primary-btn">
            + Yeni Personel Ekle
          </button>
          <button onClick={fetchUsers} className="refresh-btn">
            ↻ Yenile
          </button>
        </div>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>Henüz kayıtlı kullanıcı yok.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ad Soyad</th>
                  <th>Kullanıcı Adı</th>
                  <th>Rol</th>
                  <th>Durum</th>
                  <th>Oluşturulma</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="title-cell">{u.fullName}</td>
                    <td>{u.username}</td>
                    <td>
                      <span
                        className={`role-badge ${
                          u.role === 'Admin' ? 'role-admin' : 'role-personnel'
                        }`}
                      >
                        {u.role === 'Admin' ? 'Yönetici' : 'Personel'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          u.isActive ? 'resolved' : 'cancelled'
                        }`}
                      >
                        {u.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td className="action-cell">
                      <button
                        className="action-btn"
                        onClick={() => handleToggleActive(u.id)}
                        disabled={actionId === u.id || u.id === parseInt(localStorage.getItem('userId') || '0')}
                        title={u.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                      >
                        {actionId === u.id
                          ? '...'
                          : u.isActive
                          ? 'Pasifleştir'
                          : 'Aktifleştir'}
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => openPasswordModal(u)}
                      >
                        Şifre Sıfırla
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* YENİ KULLANICI MODALI */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Personel Ekle</h2>
              <button className="modal-close" onClick={closeCreateModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreate} noValidate>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="fullName">Ad Soyad</label>
                  <input
                    type="text"
                    id="fullName"
                    value={createForm.fullName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, fullName: e.target.value })
                    }
                    placeholder="Örn: Ahmet Yılmaz"
                    maxLength={100}
                  />
                  {createErrors.fullName && (
                    <span className="error-text">{createErrors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Kullanıcı Adı</label>
                  <input
                    type="text"
                    id="username"
                    value={createForm.username}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, username: e.target.value })
                    }
                    placeholder="Örn: ahmet"
                    maxLength={50}
                  />
                  {createErrors.username && (
                    <span className="error-text">{createErrors.username}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Şifre</label>
                  <input
                    type="password"
                    id="password"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    placeholder="En az 6 karakter"
                  />
                  {createErrors.password && (
                    <span className="error-text">{createErrors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol</label>
                  <select
                    id="role"
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, role: e.target.value })
                    }
                  >
                    <option value="Personnel">Personel</option>
                    <option value="Admin">Yönetici</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="modal-btn modal-btn-save"
                  disabled={creating}
                >
                  {creating ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ŞİFRE SIFIRLAMA MODALI */}
      {passwordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Şifre Sıfırla</h2>
              <button className="modal-close" onClick={closePasswordModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleResetPassword} noValidate>
              <div className="modal-body">
                <div className="modal-info">
                  <strong>Kullanıcı:</strong> {passwordModal.fullName} (
                  {passwordModal.username})
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Yeni Şifre</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="En az 6 karakter"
                  />
                  {passwordError && (
                    <span className="error-text">{passwordError}</span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={closePasswordModal}
                  disabled={resettingPassword}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="modal-btn modal-btn-save"
                  disabled={resettingPassword}
                >
                  {resettingPassword ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;