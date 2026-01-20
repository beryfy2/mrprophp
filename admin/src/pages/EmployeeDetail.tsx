import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Employee } from '../../../common/types';
import { getJSON, sendForm } from '../lib/api';

export default function EmployeeDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const isNew = id === 'new';

  const [emp, setEmp] = useState<Employee | null>(() =>
    isNew
      ? ({
          firstName: '',
          lastName: '',
          name: '',
          email: '',
          position: '',
          designation: '',
          department: '',
          phone: '',
          gender: '',
          bloodGroup: '',
          maritalStatus: '',
          bio: '',
          dob: '',
          joinDate: '',
          manager: '',
          salary: '',
          employeeId: '',
          employmentType: '',
          workLocation: '',
          educationLevel: '',
          degree: '',
          institution: '',
          graduationYear: ''
          , isAdvisor: false
        } as Employee)
      : null
  );

  const [preview, setPreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getJSON<Employee>(`/employees/${id}`).then((data) => {
      setEmp(data);
      setPreview(data.photoUrl);
    });
  }, [id, isNew]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!emp) return;

    const required = [
      ['Email', emp.email],
      ['Position', emp.position],
      ['Department', emp.department]
    ];
    const nameCandidate =
      `${(emp.firstName || '').trim()} ${(emp.lastName || '').trim()}`.trim() ||
      (emp.name || '').trim();
    const missing = required
      .filter(([, v]) => !String(v || '').trim())
      .map(([k]) => k);
    if (!nameCandidate) missing.unshift('Name');
    if (missing.length > 0) {
      alert(`Please fill required fields: ${missing.join(', ')}`);
      return;
    }

    const form = new FormData();
    Object.entries(emp).forEach(([k, v]) => {
      if (v !== undefined && v !== null && k !== '_id') {
        form.append(k, String(v));
      }
    });
    const combinedName = `${emp.firstName || ''}${
      emp.firstName && emp.lastName ? ' ' : ''
    }${emp.lastName || ''}`.trim();
    if (combinedName) form.set('name', combinedName);

    const input = document.getElementById('photoInput') as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) form.append('photo', file);

    try {
      setSaving(true);
      if (id === 'new') {
        await sendForm<Employee>(`/employees`, form, 'POST');
        alert('Employee created');
        navigate('/admin/employees');
        return;
      }
      const updated = await sendForm<Employee>(`/employees/${id}`, form, 'PUT');
      setEmp(updated);
      alert('Employee saved');
    } catch (e) {
      const msg = typeof e === 'object' && e && 'message' in e ? String((e as Error).message) : 'Failed to save employee.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  if (!emp) return <div>Loading...</div>;

  return (
  <div>
    <button className="btn" onClick={() => navigate('/admin/employees')}>
      ← Back to Employees
    </button>

    {/* TWO COLUMN LAYOUT */}
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

      {/* LEFT — PHOTO ONLY */}
      <div style={{ width: 260 }}>
        <div className="card" style={{ display: 'grid', gap: 12, placeItems: 'center' }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              fontSize: 28
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              emp.firstName?.[0] || emp.name?.[0] || 'A'
            )}
          </div>

          <label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
            <span className="btn">Upload Photo</span>
          </label>

          <div style={{ color: '#6B7280', fontSize: 12 }}>
            Square image, at least 400×400px
          </div>
        </div>
      </div>

      {/* RIGHT — COMPLETE ORIGINAL FORM (UNCHANGED) */}
      <div style={{ flex: 1, display: 'grid', gap: 16 }}>

        {/* CONTACT INFORMATION */}
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            Contact Information
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="Email Address"
              value={emp.email || ''}
              onChange={(e) => setEmp({ ...emp, email: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Phone Number"
              value={emp.phone || ''}
              onChange={(e) => setEmp({ ...emp, phone: e.target.value })}
            />
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            Personal Information
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="First Name"
              value={emp.firstName || ''}
              onChange={(e) => setEmp({ ...emp, firstName: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Last Name"
              value={emp.lastName || ''}
              onChange={(e) => setEmp({ ...emp, lastName: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <select
              className="input"
              value={emp.gender || ''}
              onChange={(e) => setEmp({ ...emp, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              className="input"
              value={emp.bloodGroup || ''}
              onChange={(e) => setEmp({ ...emp, bloodGroup: e.target.value })}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="grid-2">
            <select
              className="input"
              value={emp.maritalStatus || ''}
              onChange={(e) => setEmp({ ...emp, maritalStatus: e.target.value })}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            <input
              className="input"
              type="date"
              placeholder="Date of Birth"
              value={emp.dob || ''}
              onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
            />
          </div>

          <textarea
            className="input"
            rows={3}
            placeholder="Bio"
            value={emp.bio || ''}
            onChange={(e) => setEmp({ ...emp, bio: e.target.value })}
          />
        </div>

        {/* JOB DETAILS */}
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            Job Details
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="Position"
              value={emp.position || ''}
              onChange={(e) => setEmp({ ...emp, position: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Designation"
              value={emp.designation || ''}
              onChange={(e) => setEmp({ ...emp, designation: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="Department"
              value={emp.department || ''}
              onChange={(e) => setEmp({ ...emp, department: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Manager"
              value={emp.manager || ''}
              onChange={(e) => setEmp({ ...emp, manager: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="Employment Type"
              value={emp.employmentType || ''}
              onChange={(e) => setEmp({ ...emp, employmentType: e.target.value })}
            />
            <input
              className="input"
              placeholder="Work Location"
              value={emp.workLocation || ''}
              onChange={(e) => setEmp({ ...emp, workLocation: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <input
              className="input"
              placeholder="Employee ID"
              value={emp.employeeId || ''}
              onChange={(e) => setEmp({ ...emp, employeeId: e.target.value })}
            />
            <input
              className="input"
              type="date"
              placeholder="Join Date"
              value={emp.joinDate || ''}
              onChange={(e) => setEmp({ ...emp, joinDate: e.target.value })}
            />
          </div>

          <input
            className="input"
            placeholder="Salary"
            value={emp.salary || ''}
            onChange={(e) => setEmp({ ...emp, salary: e.target.value })}
          />
        </div>

        {/* ADVISORY COUNCIL */}
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            Advisory Council
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={!!emp.isAdvisor}
              onChange={(e) => setEmp({ ...emp, isAdvisor: e.target.checked })}
            />
            <span>Mark as Advisory Council Member</span>
          </label>
        </div>

        {/* EDUCATION */}
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            Education
          </div>
          <div className="grid-2">
            <select
              className="input"
              value={emp.educationLevel || ''}
              onChange={(e) => setEmp({ ...emp, educationLevel: e.target.value })}
            >
              <option value="">Select Education Level</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
            <input
              className="input"
              placeholder="Degree"
              value={emp.degree || ''}
              onChange={(e) => setEmp({ ...emp, degree: e.target.value })}
            />
          </div>
          <div className="grid-2">
            <input
              className="input"
              placeholder="Institution"
              value={emp.institution || ''}
              onChange={(e) => setEmp({ ...emp, institution: e.target.value })}
            />
            <input
              className="input"
              placeholder="Graduation Year"
              value={emp.graduationYear || ''}
              onChange={(e) => setEmp({ ...emp, graduationYear: e.target.value })}
            />
          </div>
        </div>

        {/* SAVE */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Employee'}
          </button>
          <button className="btn" onClick={() => navigate('/admin/employees')}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
);
}

