"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState("light"); // Default is light theme (white)
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formImageFile, setFormImageFile] = useState(null); // base64 file data URI state
  const [editingItem, setEditingItem] = useState(null); // item object when editing, null when adding
  const [apiBase, setApiBase] = useState(() => {
    if (process.env.NEXT_PUBLIC_MAIN_SITE_URL) {
      return process.env.NEXT_PUBLIC_MAIN_SITE_URL.replace(/\/$/, "");
    }
    if (typeof window !== "undefined") {
      const port = window.location.port;
      if (port === "3000") return "http://localhost:3001";
      if (port === "3001") return "http://localhost:3000";
    }
    return "http://localhost:3001";
  });

  // Detect and resolve port conflicts automatically in local dev
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAIN_SITE_URL) return;
    if (typeof window !== "undefined") {
      const port = window.location.port;
      if (port === "3000") {
        setApiBase("http://localhost:3001");
      } else if (port === "3001") {
        setApiBase("http://localhost:3000");
      }
    }
  }, []);

  // Validate admin login session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }
      } else {
        // Fallback local mock session check
        const mockSession = localStorage.getItem("dyfi-mock-session");
        if (mockSession !== "active") {
          router.push("/login");
          return;
        }
      }
      setIsPageLoading(false);
    };

    checkAuth();
  }, [router]);

  // State arrays for dynamic CRUD modifications
  const [campaigns, setCampaigns] = useState([]);
  const [news, setNews] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [donors, setDonors] = useState([]);
  const [members, setMembers] = useState([]);

  // Fetch all entities from central API on load
  useEffect(() => {
    const entities = ["campaigns", "news", "committee", "gallery", "activities", "announcements", "donors", "members"];
    entities.forEach((entity) => {
      fetch(`${apiBase}/api/${entity}`)
        .then((res) => res.json())
        .then((data) => {
          if (entity === "campaigns") setCampaigns(data);
          else if (entity === "news") setNews(data);
          else if (entity === "committee") setCommittee(data);
          else if (entity === "gallery") setGallery(data);
          else if (entity === "activities") setActivities(data);
          else if (entity === "announcements") setAnnouncements(data);
          else if (entity === "donors") setDonors(data);
          else if (entity === "members") setMembers(data);
        })
        .catch((err) => {
          console.log(`Fetch ${entity} failed:`, err);
          // Fallback static values in case the server API is not reachable on boot
          const fallbackDefaults = {
            campaigns: [
              { id: 1, title: "Regional Job Rights Initiative", date: "2025-08-15", status: "Published", description: "Demanding fair employment opportunities for local Dakshina Kannada youth in regional public sectors, Mangaluru Port, and industrial zones.", image: "/images/hero-banner-1.jpg" },
              { id: 2, title: "Harmony & Unity Campaign", date: "2025-07-20", status: "Published", description: "Promoting communal harmony, secularism, and friendly bonds among youth across coastal towns to counter divisive narratives.", image: "/images/hero-banner-3.jpg" },
              { id: 3, title: "Anti-Drug Campus Crusade", date: "2025-06-10", status: "Draft", description: "Launching awareness campaigns in district colleges and student hubs to combat substance abuse and foster healthy lifestyles.", image: "/images/hero-banner-2.jpg" }
            ],
            news: [
              { id: 1, title: "DYFI Launches Youth Employment Survey", date: "2025-08-18", views: 245, content: "A regional survey to map employment needs and skill sets of coastal youth, covering Ullal, Mangaluru, Bantwal, and Belthangady.", image: "/images/hero-banner-1.jpg" },
              { id: 2, title: "Mangaluru Peace March Promotes Unity", date: "2025-08-10", views: 189, content: "Hundreds of youth joined the unity rally to build solidarity, peace, and mutual respect among different coastal communities.", image: "/images/hero-banner-2.jpg" }
            ],
            committee: [
              { id: 1, role: "District President", name: "Comrade Naveen", area: "DYFI Dakshina Kannada" },
              { id: 2, role: "District Secretary", name: "Comrade Santosh", area: "DYFI Dakshina Kannada" }
            ],
            gallery: [
              { id: 1, alt: "Rally Support", src: "/images/hero-banner-1.jpg" },
              { id: 2, alt: "Anti-Drug March", src: "/images/hero-banner-2.jpg" }
            ],
            activities: [
              { id: 1, title: "Coastal Harmony Youth Meet", date: "2025-08-01", description: "Mangaluru city hosted a regional youth meetup focusing on promoting peace and friendly cultural exchanges.", image: "/images/hero-banner-2.jpg" },
              { id: 2, title: "Monsoon Distress Support", date: "2025-07-15", description: "DYFI teams provided voluntary cleanup and flood rehabilitation services to affected coastal communities in Ullal.", image: "/images/hero-banner-1.jpg" }
            ],
            announcements: [
              { id: 1, type: "CIRCULAR", title: "Taluk Assembly Review Report", content: "All Local Unit committees must submit their youth survey reports to the respective taluk centers by September 5, 2026.", date: "August 25, 2026" }
            ],
            donors: [
              { id: 1, name: "Arjun Rao", phone: "9876543210", group: "O+", area: "Ullal" },
              { id: 2, name: "Prerna Amin", phone: "9448123450", group: "B+", area: "Mangaluru City" }
            ],
            members: [
              { id: "DK-2025-781290", name: "Mohammad Harris", phone: "9008123456", area: "Bantwal", type: "Youth", date: "2026-08-24" },
              { id: "DK-2025-612984", name: "Divya Shetty", phone: "8971234567", area: "Moodbidri", type: "Student", date: "2026-08-25" }
            ]
          };
          const defs = fallbackDefaults[entity];
          if (entity === "campaigns") setCampaigns(defs);
          else if (entity === "news") setNews(defs);
          else if (entity === "committee") setCommittee(defs);
          else if (entity === "gallery") setGallery(defs);
          else if (entity === "activities") setActivities(defs);
          else if (entity === "announcements") setAnnouncements(defs);
          else if (entity === "donors") setDonors(defs);
          else if (entity === "members") setMembers(defs);
        });
    });
  }, [apiBase]);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // campaigns, news, committee, gallery, activities, announcements, donors, members

  // Form Field States
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStatus, setFormStatus] = useState("Published");
  const [formViews, setFormViews] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formName, setFormName] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formAlt, setFormAlt] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGroup, setFormGroup] = useState("O+");
  const [formType, setFormType] = useState("Youth");
  const [formContent, setFormContent] = useState("");
  const [formTarget, setFormTarget] = useState("All");
  const [formDesc, setFormDesc] = useState("");
  const [formImageName, setFormImageName] = useState("No file chosen");

  // Style variables matching theme state
  const colors = {
    bgPage: theme === "dark" ? "#0f172a" : "#f1f5f9",
    textMain: theme === "dark" ? "#f8fafc" : "#0f172a",
    bgCard: theme === "dark" ? "#1e293b" : "#ffffff",
    borderMain: theme === "dark" ? "#334155" : "#cbd5e1",
    textMuted: theme === "dark" ? "#94a3b8" : "#475569",
    bgSidebar: theme === "dark" ? "#1e293b" : "#ffffff",
    sidebarBorder: theme === "dark" ? "#334155" : "#cbd5e1",
    bgTableHead: theme === "dark" ? "#1e293b" : "#f8fafc",
    tableRowBorder: theme === "dark" ? "#334155" : "#f1f5f9",
    inputBg: theme === "dark" ? "#0f172a" : "#f8fafc",
    inputText: theme === "dark" ? "#f8fafc" : "#0f172a",
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Resolve image URLs: relative paths like /images/... need to load from the main website,
  // not the admin dashboard (which doesn't have those files in its public folder).
  // Base64 data URIs and absolute Cloudinary URLs pass through unchanged.
  const resolveImageUrl = (src) => {
    if (!src) return "/images/hero-banner-1.jpg";
    // Already an absolute URL (Cloudinary, etc.) or data URI — use as-is
    if (src.startsWith("http") || src.startsWith("data:")) return src;
    // Relative path — prefix with main website's base URL
    return `${apiBase}${src}`;
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("dyfi-mock-session");
    }
    router.push("/login");
  };

  // Open Add Modal
  const openAddModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setIsModalOpen(true);
    setIsSaving(false);
    // Reset form states
    setFormTitle("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormStatus("Published");
    setFormViews(Math.floor(Math.random() * 100).toString());
    setFormRole("");
    setFormName("");
    setFormArea(type === "committee" ? "Dakshina Kannada District" : "Mangaluru City");
    setFormAlt("");
    setFormPhone("");
    setFormGroup("O+");
    setFormType(type === "announcements" ? "CIRCULAR" : "Youth");
    setFormContent("");
    setFormTarget("All");
    setFormDesc("");
    setFormImageName("No file chosen");
    setFormImageFile(null); // Reset image payload state
  };

  // Open Edit Modal for an existing record
  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    setIsSaving(false);

    // Pre-populate fields based on entity
    if (type === "committee") {
      setFormName(item.name || "");
      setFormRole(item.role || "");
      setFormArea(item.area || "Dakshina Kannada District");
      setFormImageName(item.image || item.photo ? "Current photo attached" : "No file chosen");
      setFormImageFile(null);
    } else if (type === "campaigns") {
      setFormTitle(item.title || "");
      setFormDate(item.date || "");
      setFormStatus(item.status || "Published");
      setFormDesc(item.description || "");
      setFormImageName(item.image ? "Current image attached" : "No file chosen");
      setFormImageFile(null);
    } else if (type === "news") {
      setFormTitle(item.title || "");
      setFormDate(item.date || "");
      setFormViews(String(item.views || 0));
      setFormContent(item.content || "");
      setFormImageName(item.image ? "Current image attached" : "No file chosen");
      setFormImageFile(null);
    } else if (type === "activities") {
      setFormTitle(item.title || "");
      setFormDate(item.date || "");
      setFormDesc(item.description || "");
      setFormImageName(item.image ? "Current image attached" : "No file chosen");
      setFormImageFile(null);
    }
  };

  // Mock Photo Picker file selection trigger
  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImageName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageFile(reader.result); // Save Base64 Data URI
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Actions
  // CRUD Actions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const isEdit = !!editingItem;
    const currentId = isEdit ? editingItem.id : String(Date.now());
    let imageUrl = isEdit ? (editingItem.image || editingItem.photo || editingItem.src || "") : "/images/hero-banner-1.jpg";

    // Upload image to Cloudinary via backend if selected
    if (formImageFile) {
      try {
        const uploadRes = await fetch(`${apiBase}/api/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: formImageFile })
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          imageUrl = uploadData.url;
        } else {
          console.error("Upload failed:", uploadData.error);
        }
      } catch (err) {
        console.error("Cloudinary upload failed, using fallback:", err);
      }
    }

    let requestBody = {};

    if (modalType === "campaigns") {
      requestBody = { id: currentId, title: formTitle, date: formDate, status: formStatus, description: formDesc, image: imageUrl };
    } else if (modalType === "news") {
      requestBody = { id: currentId, title: formTitle, date: formDate, views: parseInt(formViews) || 0, content: formContent, image: imageUrl };
    } else if (modalType === "committee") {
      requestBody = { id: currentId, role: formRole, name: formName, area: formArea, image: imageUrl || (isEdit ? (editingItem.image || editingItem.photo || "") : "") };
    } else if (modalType === "gallery") {
      requestBody = { id: currentId, alt: formAlt, src: imageUrl };
    } else if (modalType === "activities") {
      requestBody = { id: currentId, title: formTitle, date: formDate, description: formDesc, image: imageUrl };
    } else if (modalType === "announcements") {
      requestBody = { id: currentId, type: formType, title: formTitle, content: formContent, target: formTarget, date: formDate };
    } else if (modalType === "donors") {
      requestBody = { id: currentId, name: formName, phone: formPhone, group: formGroup, area: formArea };
    } else if (modalType === "members") {
      const generatedId = isEdit ? currentId : ("DK-2025-" + Math.floor(100000 + Math.random() * 900000));
      requestBody = { id: generatedId, name: formName, phone: formPhone, area: formArea, type: formType, date: formDate };
    }

    // Call POST API on the website server
    try {
      const res = await fetch(`${apiBase}/api/${modalType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const resData = await res.json();
      const itemToSave = resData.success ? resData.data : requestBody;
      
      if (isEdit) {
        if (modalType === "campaigns") setCampaigns(campaigns.map(c => String(c.id) === String(currentId) ? itemToSave : c));
        else if (modalType === "news") setNews(news.map(n => String(n.id) === String(currentId) ? itemToSave : n));
        else if (modalType === "committee") setCommittee(committee.map(m => String(m.id) === String(currentId) ? itemToSave : m));
        else if (modalType === "gallery") setGallery(gallery.map(g => String(g.id) === String(currentId) ? itemToSave : g));
        else if (modalType === "activities") setActivities(activities.map(a => String(a.id) === String(currentId) ? itemToSave : a));
        else if (modalType === "announcements") setAnnouncements(announcements.map(an => String(an.id) === String(currentId) ? itemToSave : an));
        else if (modalType === "donors") setDonors(donors.map(d => String(d.id) === String(currentId) ? itemToSave : d));
        else if (modalType === "members") setMembers(members.map(m => String(m.id) === String(currentId) ? itemToSave : m));
      } else {
        if (modalType === "campaigns") setCampaigns([itemToSave, ...campaigns]);
        else if (modalType === "news") setNews([itemToSave, ...news]);
        else if (modalType === "committee") setCommittee([itemToSave, ...committee]);
        else if (modalType === "gallery") setGallery([itemToSave, ...gallery]);
        else if (modalType === "activities") setActivities([itemToSave, ...activities]);
        else if (modalType === "announcements") setAnnouncements([itemToSave, ...announcements]);
        else if (modalType === "donors") setDonors([itemToSave, ...donors]);
        else if (modalType === "members") setMembers([itemToSave, ...members]);
      }
    } catch (err) {
      console.log(`Save ${modalType} API failed:`, err);
      // Fallback state update
      const fallbackItem = requestBody;
      if (isEdit) {
        if (modalType === "campaigns") setCampaigns(campaigns.map(c => String(c.id) === String(currentId) ? fallbackItem : c));
        else if (modalType === "news") setNews(news.map(n => String(n.id) === String(currentId) ? fallbackItem : n));
        else if (modalType === "committee") setCommittee(committee.map(m => String(m.id) === String(currentId) ? fallbackItem : m));
        else if (modalType === "gallery") setGallery(gallery.map(g => String(g.id) === String(currentId) ? fallbackItem : g));
        else if (modalType === "activities") setActivities(activities.map(a => String(a.id) === String(currentId) ? fallbackItem : a));
        else if (modalType === "announcements") setAnnouncements(announcements.map(an => String(an.id) === String(currentId) ? fallbackItem : an));
        else if (modalType === "donors") setDonors(donors.map(d => String(d.id) === String(currentId) ? fallbackItem : d));
        else if (modalType === "members") setMembers(members.map(m => String(m.id) === String(currentId) ? fallbackItem : m));
      } else {
        if (modalType === "campaigns") setCampaigns([fallbackItem, ...campaigns]);
        else if (modalType === "news") setNews([fallbackItem, ...news]);
        else if (modalType === "committee") setCommittee([fallbackItem, ...committee]);
        else if (modalType === "gallery") setGallery([fallbackItem, ...gallery]);
        else if (modalType === "activities") setActivities([fallbackItem, ...activities]);
        else if (modalType === "announcements") setAnnouncements([fallbackItem, ...announcements]);
        else if (modalType === "donors") setDonors([fallbackItem, ...donors]);
        else if (modalType === "members") setMembers([fallbackItem, ...members]);
      }
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = (type, id) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      fetch(`${apiBase}/api/${type}?id=${id}`, {
        method: "DELETE"
      })
      .then((res) => res.json())
      .then((resData) => {
        if (type === "campaigns") setCampaigns(campaigns.filter((item) => item.id !== id));
        else if (type === "news") setNews(news.filter((item) => item.id !== id));
        else if (type === "committee") setCommittee(committee.filter((item) => item.id !== id));
        else if (type === "gallery") setGallery(gallery.filter((item) => item.id !== id));
        else if (type === "activities") setActivities(activities.filter((item) => item.id !== id));
        else if (type === "announcements") setAnnouncements(announcements.filter((item) => item.id !== id));
        else if (type === "donors") setDonors(donors.filter((item) => item.id !== id));
        else if (type === "members") setMembers(members.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.log(`Delete ${type} failed:`, err);
        // Fallback local delete
        if (type === "campaigns") setCampaigns(campaigns.filter((item) => item.id !== id));
        else if (type === "news") setNews(news.filter((item) => item.id !== id));
        else if (type === "committee") setCommittee(committee.filter((item) => item.id !== id));
        else if (type === "gallery") setGallery(gallery.filter((item) => item.id !== id));
        else if (type === "activities") setActivities(activities.filter((item) => item.id !== id));
        else if (type === "announcements") setAnnouncements(announcements.filter((item) => item.id !== id));
        else if (type === "donors") setDonors(donors.filter((item) => item.id !== id));
        else if (type === "members") setMembers(members.filter((item) => item.id !== id));
      });
    }
  };

  // Full page reload loader screen overlay
  if (isPageLoading) {
    return (
      <div className="global-loader-container" style={{ background: theme === "dark" ? "#0f172a" : "#f1f5f9" }}>
        <div className="thin-arc-spinner" style={{ border: theme === "dark" ? "2px solid rgba(255, 255, 255, 0.1)" : "2px solid rgba(0, 0, 0, 0.06)", borderTop: theme === "dark" ? "2px solid #fff" : "2px solid #111" }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout" style={{ background: colors.bgPage, color: colors.textMain, transition: "all 0.25s ease" }}>
      {/* Mobile Sidebar backdrop overlay */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        style={{
          background: colors.bgSidebar,
          borderRight: `1px solid ${colors.sidebarBorder}`,
          transition: "all 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="/images/logo.png" alt="DYFI Logo" style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "contain" }} />
            <div>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", letterSpacing: "0.5px" }}>DYFI DK PANEL</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: colors.textMuted }}>Database Workspace</p>
            </div>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="hamburger-btn"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.25rem",
              color: colors.textMain,
              cursor: "pointer",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
          {[
            { id: "overview", label: "Overview", icon: "bi-speedometer2" },
            { id: "campaigns", label: "Campaigns", icon: "bi-megaphone" },
            { id: "news", label: "News Bulletins", icon: "bi-newspaper" },
            { id: "committee", label: "Committee Directory", icon: "bi-people" },
            { id: "gallery", label: "Photo Gallery", icon: "bi-images" },
            { id: "activities", label: "Activities", icon: "bi-calendar-event" },
            { id: "announcements", label: "Announcements", icon: "bi-info-circle" },
            { id: "donors", label: "Blood Donors", icon: "bi-heart-fill" },
            { id: "members", label: "Members Registry", icon: "bi-card-list" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false); // Close sidebar on click inside mobile view
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: activeTab === item.id ? "#E31837" : "transparent",
                color: activeTab === item.id ? "#fff" : colors.textMuted,
                cursor: "pointer",
                textAlign: "left",
                fontWeight: "500",
                fontSize: "0.9rem",
                transition: "all 0.2s",
              }}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </nav>

        {/* Administrator Profile in Sidebar (Visible only on mobile) */}
        <div className="admin-profile-sidebar" style={{ borderTop: `1px solid ${colors.borderMain}` }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#475569", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><i className="bi bi-person-fill"></i></div>
          <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Administrator</span>
        </div>

        {/* Unified Sign Out Control */}
        <div style={{ borderTop: `1px solid ${colors.borderMain}`, paddingTop: "0.75rem", marginTop: "0.75rem", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
              width: "100%",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              transition: "background 0.2s"
            }}
          >
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${colors.borderMain}`, paddingTop: "1rem", marginTop: "1rem" }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: colors.textMuted, textAlign: "center" }}>Connected to Local Database</p>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="main-content" style={{ transition: "all 0.25s ease" }}>
        {/* Header */}
        <header style={{ background: colors.bgSidebar, borderBottom: `1px solid ${colors.sidebarBorder}`, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.25s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Hamburger Trigger Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hamburger-btn"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: colors.textMain,
                cursor: "pointer",
                padding: 0,
                alignItems: "center"
              }}
            >
              <i className="bi bi-list"></i>
            </button>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img src="/images/logo.png" alt="DYFI Logo" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
              </h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: "transparent",
                border: `1px solid ${colors.borderMain}`,
                color: colors.textMain,
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <div className="admin-profile-header">
              <span style={{ fontSize: "0.85rem", color: colors.textMuted }}>Administrator</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#475569", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><i className="bi bi-person-fill"></i></div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div style={{ padding: "2rem" }}>
          {/* OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { id: "members", label: "Active Members", count: members.length, color: "#10b981", icon: "bi-people" },
                  { id: "donors", label: "Blood Donors Registered", count: donors.length, color: "#ef4444", icon: "bi-heart-fill" },
                  { id: "campaigns", label: "Live Campaigns", count: campaigns.length, color: "#3b82f6", icon: "bi-megaphone" },
                  { id: "announcements", label: "Announcements Active", count: announcements.length, color: "#eab308", icon: "bi-info-circle" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab(stat.id)}
                    style={{
                      background: colors.bgCard,
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: `1px solid ${colors.borderMain}`,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    className="stat-card"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ color: colors.textMuted, fontSize: "0.85rem" }}>{stat.label}</span>
                      <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: "1.2rem" }}></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: "2rem", fontWeight: "800" }}>{stat.count}</h3>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.7rem", color: colors.textMuted }}>Click to view details →</p>
                  </div>
                ))}
              </div>

              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Database Configuration Guidelines</h3>
                <p style={{ fontSize: "0.9rem", color: colors.textMuted, lineHeight: "1.6" }}>
                  To link this dashboard to your remote PostgreSQL production instance, initialize schemas for membership registrations, blood donation directories, and campus assemblies. Webhook payment trigger callbacks can be mapped directly to receive transactional alerts.
                </p>
              </div>
            </div>
          )}

          {/* CAMPAIGNS PANEL */}
          {activeTab === "campaigns" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Campaign Entries</h3>
                <button onClick={() => openAddModal("campaigns")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Add Campaign</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Cover Image</th>
                      <th style={{ padding: "0.75rem" }}>Title</th>
                      <th style={{ padding: "0.75rem" }}>Launch Date</th>
                      <th style={{ padding: "0.75rem" }}>Description</th>
                      <th style={{ padding: "0.75rem" }}>Status</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ width: "50px", height: "35px", borderRadius: "4px", overflow: "hidden" }}>
                            <img src={resolveImageUrl(c.image)} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{c.title}</td>
                        <td style={{ padding: "0.75rem" }}>{c.date}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: colors.textMuted, maxWidth: "250px" }}>{c.description}</td>
                        <td style={{ padding: "0.75rem" }}><span style={{ background: c.status === "Published" ? "#10b981" : "#475569", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>{c.status}</span></td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("campaigns", c.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NEWS PANEL */}
          {activeTab === "news" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>News Bulletins</h3>
                <button onClick={() => openAddModal("news")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Publish Article</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Cover Image</th>
                      <th style={{ padding: "0.75rem" }}>Headline</th>
                      <th style={{ padding: "0.75rem" }}>Publish Date</th>
                      <th style={{ padding: "0.75rem" }}>Content Summary</th>
                      <th style={{ padding: "0.75rem" }}>Views</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((n) => (
                      <tr key={n.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ width: "50px", height: "35px", borderRadius: "4px", overflow: "hidden" }}>
                            <img src={resolveImageUrl(n.image)} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{n.title}</td>
                        <td style={{ padding: "0.75rem" }}>{n.date}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: colors.textMuted, maxWidth: "250px" }}>{n.content}</td>
                        <td style={{ padding: "0.75rem" }}>{n.views}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("news", n.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COMMITTEE PANEL */}
          {activeTab === "committee" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Committee Bearers</h3>
                <button onClick={() => openAddModal("committee")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Add Member</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem", width: "65px" }}>Photo</th>
                      <th style={{ padding: "0.75rem" }}>Designation</th>
                      <th style={{ padding: "0.75rem" }}>Name</th>
                      <th style={{ padding: "0.75rem" }}>Committee Level</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committee.map((m) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", background: colors.inputBg, border: `1px solid ${colors.borderMain}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {m.image || m.photo ? (
                              <img 
                                src={resolveImageUrl(m.image || m.photo)} 
                                alt={m.name} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                              />
                            ) : (
                              <i className="bi bi-person-fill" style={{ fontSize: "1.3rem", color: colors.textMuted }}></i>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{m.role}</td>
                        <td style={{ padding: "0.75rem" }}>{m.name}</td>
                        <td style={{ padding: "0.75rem" }}>{m.area}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                            <button onClick={() => openEditModal("committee", m)} style={{ color: "#2563eb", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: "600", fontSize: "0.85rem" }}>
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                            <button onClick={() => handleDelete("committee", m.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: "600", fontSize: "0.85rem" }}>
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GALLERY PANEL */}
          {activeTab === "gallery" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Gallery Archive</h3>
                <button onClick={() => openAddModal("gallery")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Upload Image</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.5rem" }}>
                {gallery.map((g) => (
                  <div key={g.id} style={{ background: colors.bgPage, border: `1px solid ${colors.borderMain}`, borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                    <div style={{ width: "100%", height: "120px", overflow: "hidden" }}>
                      <img src={resolveImageUrl(g.src)} alt={g.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "0.5rem", fontSize: "0.8rem", textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100px" }}>{g.alt}</span>
                      <button onClick={() => handleDelete("gallery", g.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "0.9rem" }}><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITIES PANEL */}
          {activeTab === "activities" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Activities Logs</h3>
                <button onClick={() => openAddModal("activities")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Log Activity</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Photo</th>
                      <th style={{ padding: "0.75rem" }}>Activity Title</th>
                      <th style={{ padding: "0.75rem" }}>Date Completed</th>
                      <th style={{ padding: "0.75rem" }}>Activity Description</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ width: "50px", height: "35px", borderRadius: "4px", overflow: "hidden" }}>
                            <img src={resolveImageUrl(a.image)} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{a.title}</td>
                        <td style={{ padding: "0.75rem" }}>{a.date}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: colors.textMuted, maxWidth: "300px" }}>{a.description}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("activities", a.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS PANEL */}
          {activeTab === "announcements" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Announcements</h3>
                <button onClick={() => openAddModal("announcements")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Broadcast Alert</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Type</th>
                      <th style={{ padding: "0.75rem" }}>Title</th>
                      <th style={{ padding: "0.75rem" }}>Broadcast Content</th>
                      <th style={{ padding: "0.75rem" }}>Target</th>
                      <th style={{ padding: "0.75rem" }}>Published</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((a) => (
                      <tr key={a.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}><span style={{ background: "rgba(227, 24, 55, 0.1)", color: "#E31837", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{a.type || "NOTIFICATION"}</span></td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{a.title || "—"}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: colors.textMuted, maxWidth: "250px" }}>{a.content}</td>
                        <td style={{ padding: "0.75rem" }}>{a.target}</td>
                        <td style={{ padding: "0.75rem" }}>{a.date}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("announcements", a.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BLOOD DONORS PANEL */}
          {activeTab === "donors" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Voluntary Blood Donors Register</h3>
                <button onClick={() => openAddModal("donors")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Add Donor</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Name</th>
                      <th style={{ padding: "0.75rem" }}>Contact Phone</th>
                      <th style={{ padding: "0.75rem" }}>Blood Group</th>
                      <th style={{ padding: "0.75rem" }}>Area / Taluk</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((d) => (
                      <tr key={d.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}>{d.name}</td>
                        <td style={{ padding: "0.75rem" }}>{d.phone}</td>
                        <td style={{ padding: "0.75rem" }}><span style={{ background: "#ef4444", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{d.group}</span></td>
                        <td style={{ padding: "0.75rem" }}>{d.area}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("donors", d.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MEMBERS PANEL */}
          {activeTab === "members" && (
            <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Membership Registry (₹2 Paid)</h3>
                <button onClick={() => openAddModal("members")} style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Add Member</button>
              </div>
              <div className="table-container">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderMain}`, color: colors.textMuted }}>
                      <th style={{ padding: "0.75rem" }}>Member ID</th>
                      <th style={{ padding: "0.75rem" }}>Name</th>
                      <th style={{ padding: "0.75rem" }}>Contact</th>
                      <th style={{ padding: "0.75rem" }}>Taluk</th>
                      <th style={{ padding: "0.75rem" }}>Type</th>
                      <th style={{ padding: "0.75rem" }}>Activated Date</th>
                      <th style={{ padding: "0.75rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: "0.75rem" }}><code style={{ color: "#E31837", fontWeight: "600" }}>{m.id}</code></td>
                        <td style={{ padding: "0.75rem" }}>{m.name}</td>
                        <td style={{ padding: "0.75rem" }}>{m.phone}</td>
                        <td style={{ padding: "0.75rem" }}>{m.area}</td>
                        <td style={{ padding: "0.75rem" }}><span style={{ background: m.type === "Student" ? "#3b82f6" : "#eab308", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>{m.type}</span></td>
                        <td style={{ padding: "0.75rem" }}>{m.date}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => handleDelete("members", m.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* POPUP MODAL DIALOG */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, padding: "1rem" }}>
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderMain}`, borderRadius: "12px", width: "100%", maxWidth: "500px", overflow: "hidden", color: colors.textMain, position: "relative" }}>
            
            {/* SPINNER OVERLAY FOR SAVING TRANSACTION STATE */}
            {isSaving && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.8)", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center", zIndex: 10, color: "#111" }}>
                <span className="mini-arc-spinner" style={{ width: "32px", height: "32px", border: "3px solid rgba(0,0,0,0.06)", borderTop: "3px solid #E31837" }}></span>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Saving to Database...</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: `1px solid ${colors.borderMain}` }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>{editingItem ? `Edit ${modalType === "committee" ? "Committee Bearer" : modalType}` : `Add New ${modalType === "committee" ? "Committee Bearer" : modalType}`}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingItem(null); }} style={{ background: "none", border: "none", color: colors.textMuted, fontSize: "1.25rem", cursor: "pointer" }}><i className="bi bi-x-lg"></i></button>
            </div>
            
            <form onSubmit={handleAddSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* CAMPAIGNS FORM */}
              {modalType === "campaigns" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Campaign Title *</label>
                    <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  {/* Photo Picker File Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Campaign Cover Image *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${colors.borderMain}`, padding: "0.4rem 0.75rem", borderRadius: "6px", background: colors.inputBg }}>
                      <input type="file" id="campaign-photo" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                      <label htmlFor="campaign-photo" style={{ background: "#E31837", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>Choose File</label>
                      <span style={{ fontSize: "0.8rem", color: colors.textMuted, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px" }}>{formImageName}</span>
                    </div>
                  </div>
                  {/* Detail Description Textarea */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Detail Description *</label>
                    <textarea required rows="3" placeholder="Enter campaign objectives, dates, and locations details..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, fontFamily: "inherit" }}></textarea>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Launch Date *</label>
                      <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, width: "100%" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Status *</label>
                      <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* NEWS FORM */}
              {modalType === "news" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>News Headline *</label>
                    <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  {/* Photo Picker File Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Article Banner Image *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${colors.borderMain}`, padding: "0.4rem 0.75rem", borderRadius: "6px", background: colors.inputBg }}>
                      <input type="file" id="news-photo" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                      <label htmlFor="news-photo" style={{ background: "#E31837", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>Choose File</label>
                      <span style={{ fontSize: "0.8rem", color: colors.textMuted, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px" }}>{formImageName}</span>
                    </div>
                  </div>
                  {/* Detail Description Textarea */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Article Content Details *</label>
                    <textarea required rows="4" placeholder="Enter news body paragraphs, announcements links, and official quotes..." value={formContent} onChange={(e) => setFormContent(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, fontFamily: "inherit" }}></textarea>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Publish Date *</label>
                      <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, width: "100%" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Initial Views</label>
                      <input type="number" value={formViews} onChange={(e) => setFormViews(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                    </div>
                  </div>
                </>
              )}

              {/* COMMITTEE FORM */}
              {modalType === "committee" && (
                <>
                  {/* Photo Picker File Input with Live Preview */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Profile Photo</label>
                    
                    {/* Image Preview if exists */}
                    {(formImageFile || (editingItem && (editingItem.image || editingItem.photo))) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.4rem" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", border: "2px solid #E31837", display: "flex", alignItems: "center", justifyContent: "center", background: colors.inputBg }}>
                          <img 
                            src={formImageFile || resolveImageUrl(editingItem.image || editingItem.photo)} 
                            alt="Preview" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                        </div>
                        <span style={{ fontSize: "0.8rem", color: colors.textMuted }}>
                          {formImageFile ? "New photo selected" : "Current profile photo"}
                        </span>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${colors.borderMain}`, padding: "0.4rem 0.75rem", borderRadius: "6px", background: colors.inputBg }}>
                      <input type="file" id="committee-photo" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                      <label htmlFor="committee-photo" style={{ background: "#E31837", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>
                        {editingItem && (editingItem.image || editingItem.photo) ? "Change Photo" : "Choose Photo"}
                      </label>
                      <span style={{ fontSize: "0.8rem", color: colors.textMuted, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px" }}>{formImageName}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Member Name *</label>
                    <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Designation/Role *</label>
                    <input type="text" required placeholder="e.g. District President" value={formRole} onChange={(e) => setFormRole(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Committee Level *</label>
                    <input type="text" required placeholder="e.g. Dakshina Kannada District" value={formArea} onChange={(e) => setFormArea(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                </>
              )}

              {/* GALLERY FORM */}
              {modalType === "gallery" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Photo Description *</label>
                    <input type="text" required placeholder="e.g. Clean-up Drive" value={formAlt} onChange={(e) => setFormAlt(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  {/* Photo Picker File Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Image File *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${colors.borderMain}`, padding: "0.4rem 0.75rem", borderRadius: "6px", background: colors.inputBg }}>
                      <input type="file" id="gallery-photo" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                      <label htmlFor="gallery-photo" style={{ background: "#E31837", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>Choose Image</label>
                      <span style={{ fontSize: "0.8rem", color: colors.textMuted, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px" }}>{formImageName}</span>
                    </div>
                  </div>
                </>
              )}

              {/* ACTIVITIES FORM */}
              {modalType === "activities" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Activity Title *</label>
                    <input type="text" required placeholder="e.g. Monsoon Relief camp" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  {/* Photo Picker File Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Activity Cover Image *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${colors.borderMain}`, padding: "0.4rem 0.75rem", borderRadius: "6px", background: colors.inputBg }}>
                      <input type="file" id="activity-photo" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                      <label htmlFor="activity-photo" style={{ background: "#E31837", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>Choose Image</label>
                      <span style={{ fontSize: "0.8rem", color: colors.textMuted, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px" }}>{formImageName}</span>
                    </div>
                  </div>
                  {/* Detail Description Textarea */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Activity Details & Description *</label>
                    <textarea required rows="3" placeholder="Enter logs details, volunteer counts, distributed aid items..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, fontFamily: "inherit" }}></textarea>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Completion Date *</label>
                    <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, width: "100%" }} />
                  </div>
                </>
              )}

              {/* ANNOUNCEMENTS FORM */}
              {modalType === "announcements" && (
                <>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Announcement Title *</label>
                      <input type="text" required placeholder="e.g. Taluk Assembly Review" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Type *</label>
                      <select value={formType} onChange={(e) => setFormType(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="CIRCULAR">CIRCULAR</option>
                        <option value="NOTIFICATION">NOTIFICATION</option>
                        <option value="URGENT">URGENT</option>
                        <option value="GENERAL">GENERAL</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Announcement Content *</label>
                    <textarea required rows="3" placeholder="Enter official broadcast alert details..." value={formContent} onChange={(e) => setFormContent(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, fontFamily: "inherit" }}></textarea>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Broadcast Target *</label>
                      <input type="text" required value={formTarget} onChange={(e) => setFormTarget(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Publish Date *</label>
                      <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, width: "100%" }} />
                    </div>
                  </div>
                </>
              )}

              {/* DONORS FORM */}
              {modalType === "donors" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Donor Full Name *</label>
                    <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Contact Phone *</label>
                    <input type="tel" required pattern="[0-9]{10}" placeholder="10-digit phone number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Blood Group *</label>
                      <select value={formGroup} onChange={(e) => setFormGroup(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Area/Taluk *</label>
                      <select value={formArea} onChange={(e) => setFormArea(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="Mangaluru City">Mangaluru City</option>
                        <option value="Ullal">Ullal</option>
                        <option value="Bantwal">Bantwal</option>
                        <option value="Puttur">Puttur</option>
                        <option value="Belthangady">Belthangady</option>
                        <option value="Moodbidri">Moodbidri</option>
                        <option value="Sullia">Sullia</option>
                        <option value="Kadaba">Kadaba</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* MEMBERS FORM */}
              {modalType === "members" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Member Full Name *</label>
                    <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Phone Number *</label>
                    <input type="tel" required pattern="[0-9]{10}" placeholder="10-digit phone number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }} />
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Type *</label>
                      <select value={formType} onChange={(e) => setFormType(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="Youth">Youth / Worker</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Area/Taluk *</label>
                      <select value={formArea} onChange={(e) => setFormArea(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText }}>
                        <option value="Mangaluru City">Mangaluru City</option>
                        <option value="Ullal">Ullal</option>
                        <option value="Bantwal">Bantwal</option>
                        <option value="Puttur">Puttur</option>
                        <option value="Belthangady">Belthangady</option>
                        <option value="Moodbidri">Moodbidri</option>
                        <option value="Sullia">Sullia</option>
                        <option value="Kadaba">Kadaba</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "500" }}>Activation Date *</label>
                    <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: `1px solid ${colors.borderMain}`, background: colors.inputBg, color: colors.inputText, width: "100%" }} />
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: `1px solid ${colors.borderMain}`, paddingTop: "1.25rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingItem(null); }} style={{ background: "transparent", border: `1px solid ${colors.borderMain}`, color: colors.textMain, padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                <button type="submit" style={{ background: "#E31837", border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>{editingItem ? "Update Record" : "Save Entry"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
