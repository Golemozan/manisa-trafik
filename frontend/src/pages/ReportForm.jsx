import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { MANISA_DISTRICTS } from '../utils/constants';

function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: '',
    reportDate: ''
  });

  const [errors, setErrors] = useState({});

  
  const [submitting, setSubmitting] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Başlık en az 3 karakter olmalı';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Başlık en fazla 200 karakter olabilir';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama zorunludur';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalı';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Açıklama en fazla 2000 karakter olabilir';
    }

    if (!formData.district) {
      newErrors.district = 'İlçe seçimi zorunludur';
    }

    if (!formData.reportDate) {
      newErrors.reportDate = 'Tarih zorunludur';
    } else {
      const selected = new Date(formData.reportDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        newErrors.reportDate = 'Gelecek bir tarih seçemezsiniz';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Lütfen formdaki hataları düzeltin');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        district: formData.district,
        reportDate: new Date(formData.reportDate).toISOString()
      };

      await api.post('/reports', payload);

      toast.success('Bildiriminiz başarıyla alındı. Teşekkür ederiz!');

      
      setFormData({
        title: '',
        description: '',
        district: '',
        reportDate: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Bildirim gönderme hatası:', error);
      toast.error('Bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-form-container">
      <a href="https://www.manisa.bel.tr/" className="back-site-link">
        ← Web Sitesine Geri Dön
      </a>
      <a href="/admin/login" className="admin-top-link">
        Yetkili Girişi
      </a>
      <div className="report-form-card">
        <h1>Manisa Trafik Aksaklık Bildirimi</h1>
        <p className="subtitle">
          Şehrimizdeki trafik aksaklıklarını yetkililere bildirin
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">İhbar Başlığı</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Atatürk Caddesi'nde çukur"
              maxLength={200}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Detaylı Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Aksaklığı detaylı şekilde açıklayın..."
              rows={5}
              maxLength={2000}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="district">İlçe</label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
            >
              <option value="">İlçe seçiniz</option>
              {MANISA_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <span className="error-text">{errors.district}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reportDate">Tarih</label>
            <input
              type="date"
              id="reportDate"
              name="reportDate"
              value={formData.reportDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.reportDate && (
              <span className="error-text">{errors.reportDate}</span>
            )}
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Gönderiliyor...' : 'Bildirimi Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;