
import {
    Wifi,
    WifiOff,
    LoaderCircle,
    Power,
    RefreshCw,
    Send,
    AlertCircle,
} from "lucide-react";

export default function ConnectionCard({
    connectionStatus,
    connectionError,
    onConnect,
    onDisconnect,
    onRefresh,
    onPing,
}) {

    const isConnected = connectionStatus === "connected";
    const isConnecting = connectionStatus === "connecting";
    const hasError = connectionStatus === "error";

    const statusInfo = {
        connected: {
            title: "Conectada",
            description: "La CNC esta disponible para comunicarse.",
        },

        connecting: {
            title: "Conectando...",
            description: "Estableciendo comunicacion con el ESP32.",
        },

        disconnected: {
            title: "Desconectada",
            description: "No existe una conexion WebSocket activa.",
        },

        error: {
            title: "Error de conexion",
            description: "No fue posible establecer la conexion.",
        },
    };

    const currentStatus = statusInfo[connectionStatus];

    return (

        <section className="connection-card">

            <div className="section-heading">

                <div>
                    <span className="eyebrow">COMUNICACION</span>
                    <h2>Conexion con la maquina</h2>
                </div>

                <div className={`connection-indicator ${connectionStatus}`}>
                    <span className="status-dot"></span>
                    {currentStatus.title}
                </div>

            </div>

            <div className="connection-main">

                <div className={`connection-icon ${connectionStatus}`}>

                    {isConnecting ? (
                        <LoaderCircle className="spin" size={30} />
                    ) : isConnected ? (
                        <Wifi size={30} />
                    ) : hasError ? (
                        <AlertCircle size={30} />
                    ) : (
                        <WifiOff size={30} />
                    )}

                </div>

                <div className="connection-description">

                    <h3>{currentStatus.title}</h3>

                    <p>{currentStatus.description}</p>

                    <span className="connection-address">
                        ws://192.168.4.1:81
                    </span>

                </div>

                <button
                    className={`primary-button ${isConnected ? "danger-button" : ""}`}
                    onClick={isConnected ? onDisconnect : onConnect}
                    disabled={isConnecting}
                >

                    {isConnecting ? (
                        <LoaderCircle size={17} className="spin" />
                    ) : (
                        <Power size={17} />
                    )}

                    {isConnecting
                        ? "Conectando..."
                        : isConnected
                            ? "Desconectar"
                            : "Conectar CNC"
                    }

                </button>

            </div>

            {connectionError && (

                <div className="error-message">
                    <AlertCircle size={17} />
                    <span>{connectionError}</span>
                </div>

            )}

            <div className="connection-actions">

                <button
                    className="secondary-button"
                    onClick={onRefresh}
                >
                    <RefreshCw size={16} />
                    Consultar estado HTTP
                </button>

                <button
                    className="secondary-button"
                    onClick={onPing}
                    disabled={!isConnected}
                >
                    <Send size={16} />
                    Enviar PING
                </button>

            </div>

        </section>

    );

}
