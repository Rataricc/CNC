// 
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Box,
  Cable,
  CheckCircle2,
  CircleDot,
  Cpu,
  Gauge,
  Grid2X2,
  Layers3,
  Move,
  PenTool,
  Radio,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";

import { useCncConnection } from "./hooks/useCncConnection";

import ConnectionCard from "./components/ConnectionCard";
import InfoCard from "./components/InfoCard";
import ActivityLog from "./components/ActivityLog";

import ManualControls from "./components/ManualControls";

import { CNC_CONFIG } from "./services/cncConfig";

import "./App.css";

function App() {

  const {
    connectionStatus,
    deviceStatus,
    connectionError,
    logs,
    connect,
    disconnect,
    sendPing,
    sendCommand,
    refreshStatus,
  } = useCncConnection();

  const isConnected = connectionStatus === "connected";

  const httpStatus = deviceStatus?.http || "PENDIENTE";

  const websocketStatus = isConnected
    ? "ONLINE"
    : "OFFLINE";

  const clientCount = deviceStatus?.connectedClients ?? "--";

  async function handleRefreshStatus() {

    try {

      await refreshStatus();

    } catch (error) {

      console.error(
        "Error consultando el estado de la CNC:",
        error.message
      );

    }

  }

  return (

    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <Layers3 size={23} />
          </div>

          <div className="brand-text">
            <h2>CNC<span>LAB</span></h2>
            <p>MACHINE CONTROL</p>
          </div>

        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-section">

          <span className="sidebar-label">
            WORKSPACE
          </span>

          <nav className="sidebar-nav">

            <a href="#overview" className="nav-item active">
              <Grid2X2 size={18} />
              <span>Dashboard</span>
            </a>

            <a href="#connection" className="nav-item">
              <Radio size={18} />
              <span>Comunicacion</span>
            </a>


            <a href="#manual-control" className="nav-item">
              <Move size={18} />
              <span>Control de ejes</span>
            </a>

            {/* <a href="#motion" className="nav-item disabled-nav">
              <Move size={18} />
              <span>Control de ejes</span>
              <small>Pronto</small>
            </a> */}

            <a href="#activity" className="nav-item">
              <Activity size={18} />
              <span>Actividad</span>
            </a>

          </nav>

        </div>

        <div className="sidebar-section">

          <span className="sidebar-label">
            HERRAMIENTAS
          </span>

          <nav className="sidebar-nav">

            <a href="#future" className="nav-item disabled-nav">
              <PenTool size={18} />
              <span>Editor de dibujos</span>
            </a>

            <a href="#future" className="nav-item disabled-nav">
              <Settings size={18} />
              <span>Configuracion</span>
            </a>

          </nav>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-device">

            <div className={`device-indicator ${isConnected ? "online" : ""}`}>
              <CircleDot size={17} />
            </div>

            <div>
              <strong>ESP32 Controller</strong>
              <span>{isConnected ? "En linea" : "Desconectado"}</span>
            </div>

          </div>

          <div className="sidebar-version">
            CNC LAB · VERSION 1.0
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content" id="overview">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">

            <div className="local-badge">
              <ShieldCheck size={15} />
              RED LOCAL
            </div>

            <div className="topbar-avatar">
              <Cpu size={19} />
            </div>

          </div>

        </header>

        {/* PAGE HEADER */}

        <section className="page-header">

          <div>

            <div className="welcome-label">
              <Sparkles size={15} />
              SISTEMA DE CONTROL CNC
            </div>

            <h1>
              Panel de <span>control.</span>
            </h1>

            <p>
              Administra y monitorea tu maquina CNC desde un unico lugar.
            </p>

          </div>

          <div className="page-header-status">

            <span className={`live-dot ${isConnected ? "online" : ""}`}></span>

            {isConnected
              ? "SISTEMA CONECTADO"
              : "ESPERANDO CONEXION"
            }

          </div>

        </section>

        {/* INFORMATION CARDS */}

        <section className="info-grid">

          <InfoCard
            title="Controlador"
            value={deviceStatus?.device || "CNC-ESP32"}
            description="Unidad de procesamiento"
            icon={Cpu}
            color="blue"
            badge="ESP32"
          />

          <InfoCard
            title="Servidor HTTP"
            value={httpStatus}
            description="API de comunicacion"
            icon={Cable}
            color="purple"
            badge="PUERTO 80"
          />

          <InfoCard
            title="WebSocket"
            value={websocketStatus}
            description="Canal bidireccional"
            icon={Radio}
            color="green"
            badge="PUERTO 81"
          />

          <InfoCard
            title="Clientes WiFi"
            value={clientCount}
            description="Dispositivos conectados"
            icon={Wifi}
            color="orange"
            badge="ACCESS POINT"
          />

        </section>

        {/* CONNECTION */}

        <section id="connection" className="content-section">

          <ConnectionCard
            connectionStatus={connectionStatus}
            connectionError={connectionError}
            onConnect={connect}
            onDisconnect={disconnect}
            onRefresh={handleRefreshStatus}
            onPing={sendPing}
          />

        </section>

        {/* MACHINE CONTROL */}

        <section id="motion" className="machine-grid">

          <div className="panel machine-panel">

            <div className="section-heading">

              <div>
                <span className="eyebrow">MOVIMIENTO</span>
                <h2>Centro de control</h2>
              </div>

              <span className="coming-soon">
                <Zap size={13} />
                PROXIMAMENTE
              </span>

            </div>

            <div className="machine-preview">

              {/* <div className="preview-header">
                <span>COORDENADAS DE MAQUINA</span>
                <span>UNIDAD: MM</span>
              </div> */}

              <div className="preview-header">
                <span>COORDENADAS DE MAQUINA</span>
                <span>UNIDAD: PASOS LOGICOS</span>
              </div>

              <div className="coordinates-grid">

                <div className="coordinate-card">
                  {/* <span className="axis-label axis-x">X</span>
                  <strong>0.00</strong>
                  <span>POSICION X</span> */}
                  <strong>
                    {deviceStatus?.positionX ?? 0}
                  </strong>
                  <span>POSICION X</span>
                </div>

                <div className="coordinate-card">
                  {/* <span className="axis-label axis-y">Y</span>
                  <strong>0.00</strong>
                  <span>POSICION Y</span> */}
                  <strong>
                    {deviceStatus?.positionY ?? 0}
                  </strong>
                  <span>POSICION Y</span>
                </div>

                <div className="coordinate-card">
                  {/* <span className="axis-label axis-z">Z</span>
                  <strong>0.00</strong>
                  <span>POSICION Z</span> */}
                  <strong>--</strong>
                  <span>POSICION DEL SERVO</span>
                </div>

              </div>

              <div className="jog-area">

                <div className="jog-description">
                  <Gauge size={17} />
                  <span>CONTROL MANUAL DE EJES</span>
                </div>

                <div className="jog-controls">

                  <button disabled>
                    <ArrowUp size={19} />
                  </button>

                  <div className="jog-middle">
                    <button disabled>
                      <ArrowLeft size={19} />
                    </button>

                    <button className="jog-center" disabled>
                      <CircleDot size={18} />
                    </button>

                    <button disabled>
                      <ArrowRight size={19} />
                    </button>
                  </div>

                  <button disabled>
                    <ArrowDown size={19} />
                  </button>

                </div>

                <p>
                  Los movimientos se habilitaran en la siguiente etapa.
                </p>

              </div>

            </div>

          </div>

          <div className="panel system-panel">

            <div className="section-heading">

              <div>
                <span className="eyebrow">INFORMACION</span>
                <h2>Estado del sistema</h2>
              </div>

              <Box size={20} className="muted-icon" />

            </div>

            <div className="system-details">

              <div className="system-detail">
                <div className="detail-icon">
                  <Wifi size={17} />
                </div>

                <div className="detail-content">
                  <span>Red WiFi</span>
                  <strong>{CNC_CONFIG.WIFI_NAME}</strong>
                </div>

                <CheckCircle2 size={17} className="detail-check" />
              </div>

              <div className="system-detail">
                <div className="detail-icon">
                  <Radio size={17} />
                </div>

                <div className="detail-content">
                  <span>Direccion IP</span>
                  <strong>{deviceStatus?.ip || CNC_CONFIG.IP_ADDRESS}</strong>
                </div>

                <CheckCircle2 size={17} className="detail-check" />
              </div>

              <div className="system-detail">
                <div className="detail-icon">
                  <Activity size={17} />
                </div>

                <div className="detail-content">
                  <span>Modo de funcionamiento</span>
                  <strong>{deviceStatus?.mode || "ACCESS POINT"}</strong>
                </div>

                <CheckCircle2 size={17} className="detail-check" />
              </div>

              <div className="system-detail">
                <div className="detail-icon">
                  <SlidersHorizontal size={17} />
                </div>

                <div className="detail-content">
                  <span>Protocolo</span>
                  <strong>HTTP + WebSocket</strong>
                </div>

                <CheckCircle2 size={17} className="detail-check" />
              </div>

            </div>

            <div className="system-footer">
              <ShieldCheck size={17} />
              Comunicacion local entre dispositivos.
            </div>

          </div>

        </section>

        {/* MANUAL CONTROLS */}

        <section
          id="manual-control"
          className="activity-section"
        >

          <ManualControls
            connectionStatus={connectionStatus}
            onSendCommand={sendCommand}
          />

        </section>

        {/* ACTIVITY LOG */}

        <section id="activity" className="activity-section">

          <ActivityLog logs={logs} />

        </section>

        {/* FOOTER */}

        <footer className="app-footer">

          <div>
            <span className="footer-dot"></span>
            CNC LAB
          </div>

          <span>
            Proyecto CNC UTN (Facultad Regional Resistencia) · Sistema de control
          </span>

          <span>
            Enzo Villordo - Atuel Esperguin - Diaz Estefania - Lautaro Rataric
          </span>

        </footer>

      </main>

    </div>

  );

}

export default App;
