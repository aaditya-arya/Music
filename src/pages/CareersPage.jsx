import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Upload, Send, Loader2, CheckCircle2, ShieldCheck, Award, UserCheck, Briefcase } from 'lucide-react';
import { fetchActiveJobs, submitJobApplication } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export default function CareersPage() {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('0-1 Years (Fresher / Entry Level)');
  const [certs, setCerts] = useState([]);
  const [notice, setNotice] = useState('Immediate Joiner (0-7 Days)');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fallbackJobs = [
    {
      id: 'job-1',
      title: 'QA/QC & TPI Inspection Engineer',
      category: 'Field Surveillance',
      experience: '3 - 8 Years',
      location: 'Gujarat / Maharashtra / Pan-India',
      points: [
        'Stage-wise inspection of pressure vessels, heat exchangers, and process piping.',
        'MTC review, PMI witnessing, and hydro-test sign-off per approved ITP/QAP.',
        'B.E./Diploma Mechanical with CSWIP 3.1 or AWS CWI preferred.'
      ]
    },
    {
      id: 'job-2',
      title: 'Certified Welding Inspector (CWI)',
      category: 'Welding Quality',
      experience: '4 - 9 Years',
      location: 'Vadodara / Shop Floor Deployments',
      points: [
        'Qualifying WPS, PQR, and Welder Performance Qualifications (WPQ).',
        'Expertise in ASME Sec IX, AWS D1.1/D1.6, and EN ISO 15614 standards.',
        'Valid CSWIP 3.1 / 3.2 or AWS CWI certification required.'
      ]
    },
    {
      id: 'job-3',
      title: 'NDT Specialist (Level II & III)',
      category: 'NDT Evaluation',
      experience: '2 - 7 Years',
      location: 'Pan-India Site Mobilization',
      points: [
        'Ultrasonic testing (UT), radiographic film interpretation (RTFI), MPI & DPT.',
        'ASNT / ISNT Level II or Level III in UT, RT, MPT, and DPT.',
        'Experience with PAUT / TOFD advanced NDT methods is an added advantage.'
      ]
    },
    {
      id: 'job-4',
      title: 'API Inspector (API 510 / 570 / 653)',
      category: 'In-Service Integrity',
      experience: '5 - 12 Years',
      location: 'Refinery & Terminal Outages',
      points: [
        'Aboveground storage tank inspection (API 653) & floor MFL scanning.',
        'Process piping (API 570) and pressure vessel (API 510) remaining life assessment.',
        'Valid API individual certification required.'
      ]
    },
    {
      id: 'job-5',
      title: 'Expediting & Vendor Auditor',
      category: 'Supply Chain QA',
      experience: '3 - 8 Years',
      location: 'Vendor Hubs Pan-India',
      points: [
        'Conducting vendor pre-qualification audits and ISO 9001 compliance reviews.',
        'Critical path fabrication schedule tracking and desk/field expediting.',
        'Engineering degree with Lead Auditor certification preferred.'
      ]
    },
    {
      id: 'job-6',
      title: 'Graduate Trainee QA/QC Engineer',
      category: 'Early Career',
      experience: '0 - 2 Years',
      location: 'Vadodara / Gujarat',
      points: [
        'Structured mentorship program under certified Level III technical surveyors.',
        'Comprehensive training in ASME/AWS codes, NDT methods, and ITP drafting.',
        'Fresh graduates in B.E./B.Tech (Mechanical/Metallurgy/Production).'
      ]
    }
  ];

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const liveJobs = await fetchActiveJobs();
        if (liveJobs && liveJobs.length > 0) {
          setJobs(liveJobs);
        } else {
          setJobs(fallbackJobs);
        }
      } catch (err) {
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleCertToggle = (certName) => {
    if (certs.includes(certName)) {
      setCerts(certs.filter(c => c !== certName));
    } else {
      setCerts([...certs, certName]);
    }
  };

  const handleSelectJobAndScroll = (jobTitle) => {
    setRole(jobTitle);
    const formElem = document.getElementById('applyForm');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      addToast('Please enter an exact 10-digit mobile number.', 'error');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      addToast('Please enter a valid work email address.', 'error');
      return;
    }

    if (!role) {
      addToast('Please select the position you are applying for.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await submitJobApplication({
        applicantName: fullName,
        email: email.trim(),
        phone: phoneClean,
        currentLocation: location,
        positionApplied: role,
        experienceYears: experience,
        certifications: certs,
        noticePeriod: notice
      }, resumeFile);

      addToast(`Thank you, <strong>${fullName}</strong>! Your application for <em>${role}</em> has been submitted to AES Human Resources.`, 'success');
      setFullName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setRole('');
      setExperience('0-1 Years (Fresher / Entry Level)');
      setCerts([]);
      setNotice('Immediate Joiner (0-7 Days)');
      setResumeFile(null);
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-800 selection:bg-brand-orange selection:text-white">
      
      {/* ================================================================= */}
      {/* 1. HERO BANNER                                                    */}
      {/* ================================================================= */}
      <section className="relative bg-brand-navy py-16 sm:py-24 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-blue/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-orange">Careers</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30 mb-4">
              Join Our Engineering Team &bull; Pan-India &amp; Global Opportunities
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Shape the Future of Technical Quality &amp; Engineering Assurance
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
              Join Akshar Engineering Services Pvt. Ltd. — where rigorous engineering standards, continuous professional certifications, and elite global industrial projects define our everyday work.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#openings"
                className="btn-premium-orange text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-lg shadow-lg inline-block"
              >
                View Open Positions
              </a>
              <a
                href="#applyForm"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg border border-white/20 transition-all inline-block"
              >
                Submit General Application
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. WHY BUILD YOUR CAREER AT AES (4 Pillars)                       */}
      {/* ================================================================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
              Engineering Excellence
            </span>
            <h2 className="text-3xl font-black text-brand-dark tracking-tight mt-1">
              Why Build Your Career at AES?
            </h2>
            <div className="heading-line-track mt-2 mb-4">
              <div className="section-accent-line"></div>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At Akshar Engineering Services, we provide an intellectually rigorous, ethically independent, and merit-driven environment designed for serious engineering professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue font-black flex items-center justify-center text-lg mb-5">
                01
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">Global Codes Mastery</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Gain deep hands-on experience with international design and fabrication codes including ASME Sec VIII/IX/B31.3, API 510/570/653, AWS D1.1, EN ISO 15614, and IBR standards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange font-black flex items-center justify-center text-lg mb-5">
                02
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">Funded Certifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Structured sponsorship, technical mentorship, and practical training for CSWIP 3.1/3.2, AWS CWI, ASNT Level III, API inspector licenses, and ISO 9001 Lead Auditor credentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue font-black flex items-center justify-center text-lg mb-5">
                03
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">Field Authority &amp; Ethics</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Operate with full corporate backing as an ISO/IEC 17020 Type-A body. You have absolute authority to uphold engineering integrity and halt non-conforming work without compromise.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange font-black flex items-center justify-center text-lg mb-5">
                04
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">Diverse High-Value Projects</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Execute inspection and surveillance across heavy refineries, petrochemical complexes, offshore platforms, cryogenic storage tanks, and multinational EPC project supply chains.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. OPEN POSITIONS SECTION                                         */}
      {/* ================================================================= */}
      <section className="py-16 bg-slate-50" id="openings">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
                Current Openings
              </span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight mt-1">
                Explore Open Engineering Roles
              </h2>
              <div className="heading-line-track mt-2 mb-3">
                <div className="section-accent-line"></div>
              </div>
              <p className="text-slate-600 text-sm">
                Select a role below to review the technical qualifications and apply directly.
              </p>
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-brand-dark shadow-xs">
                Pan-India &bull; 6 Disciplines Open
              </span>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-brand-orange/50 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded bg-blue-50 text-brand-blue uppercase tracking-wider">
                      {job.category || 'Engineering Quality'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {job.experience_years || job.experience || '3 - 8 Years'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Location: {job.location || 'Gujarat / Pan-India'}
                  </p>

                  <ul className="text-xs text-slate-600 space-y-2 mb-6 font-normal">
                    {job.points ? (
                      job.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-brand-orange font-bold">&bull;</span>
                          <span>{pt}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-1.5">
                        <span className="text-brand-orange font-bold">&bull;</span>
                        <span>{job.description}</span>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectJobAndScroll(job.title)}
                  className="w-full bg-slate-100 group-hover:bg-brand-orange group-hover:text-white text-brand-blue font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                >
                  Apply For This Position &rarr;
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. ON-PAGE APPLICATION FORM SECTION (#applyForm)                  */}
      {/* ================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200" id="applyForm">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
              Direct HR Desk
            </span>
            <h2 className="text-3xl font-black text-brand-dark tracking-tight mt-1">
              Submit Your Application
            </h2>
            <div className="heading-line-track track-center mx-auto mt-2 mb-4">
              <div className="section-accent-line"></div>
            </div>
            <p className="text-slate-600 text-sm">
              Complete the form below to apply for an active opening or submit your profile for our national engineering surveyor roster.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            <form onSubmit={handleApplicationSubmit} className="space-y-6 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number / WhatsApp (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    minLength={10}
                    maxLength={10}
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210 (10 digits)"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current City &amp; State *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vadodara, Gujarat"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Position Applying For *
                  </label>
                  <select
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                  >
                    <option value="">-- Select Preferred Role --</option>
                    <option value="QA/QC & TPI Inspection Engineer">QA/QC &amp; TPI Inspection Engineer</option>
                    <option value="Certified Welding Inspector (CWI)">Certified Welding Inspector (CWI)</option>
                    <option value="NDT Specialist (Level II & III)">NDT Specialist (Level II &amp; III)</option>
                    <option value="API Inspector (API 510 / 570 / 653)">API Inspector (API 510 / 570 / 653)</option>
                    <option value="Expediting & Vendor Auditor">Expediting &amp; Vendor Auditor</option>
                    <option value="Graduate Trainee QA/QC Engineer">Graduate Trainee QA/QC Engineer</option>
                    <option value="General Technical Roster Application">General Technical Roster Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Relevant Experience *
                  </label>
                  <select
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                  >
                    <option value="0-1 Years (Fresher / Entry Level)">0 - 1 Years (Fresher / Entry Level)</option>
                    <option value="1-3 Years (Junior Engineer)">1 - 3 Years (Junior Engineer)</option>
                    <option value="3-6 Years (Engineer / Surveyor)">3 - 6 Years (Engineer / Surveyor)</option>
                    <option value="6-10 Years (Senior Inspector)">6 - 10 Years (Senior Inspector)</option>
                    <option value="10+ Years (Lead Technical Specialist)">10+ Years (Lead Technical Specialist)</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes for Technical Certifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Technical Certifications Held (Check all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    'CSWIP 3.1 / 3.2',
                    'AWS CWI',
                    'ASNT Level II (UT/RT/MPI/DPT)',
                    'ASNT Level III',
                    'API 510 / 570 / 653',
                    'NACE / AMPP Level 2',
                    'ISO 9001 Lead Auditor',
                    'IBR Certified'
                  ].map((certName, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-brand-orange transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={certs.includes(certName)}
                        onChange={() => handleCertToggle(certName)}
                        className="text-brand-orange focus:ring-brand-orange rounded"
                      />
                      <span>{certName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notice Period / Availability *
                  </label>
                  <select
                    required
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                  >
                    <option value="Immediate Joiner (0-7 Days)">Immediate Joiner (0-7 Days)</option>
                    <option value="15 Days Notice">15 Days Notice</option>
                    <option value="30 Days Notice">30 Days Notice</option>
                    <option value="60+ Days Notice">60+ Days Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Upload Resume / CV (PDF or DOC)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-white rounded-lg p-2.5 text-center transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-brand-orange" />
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {resumeFile ? resumeFile.name : 'Click to Select Resume File (Max 15MB)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-premium-orange w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit HR Application</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
