
import { useCallback, useEffect, useRef, useState } from "react";

import { CNC_CONFIG } from "../services/cncConfig";

export function useCncConnection() {

    // Referencia al socket WebSocket
    const socketRef = useRef(null);

    // Estado de conexion
    const [connectionStatus, setConnectionStatus] = useState("disconnected");

    // Informacion recibida desde HTTP
    const [deviceStatus, setDeviceStatus] = useState(null);

    // Ultimo mensaje recibido
    const [lastMessage, setLastMessage] = useState(null);

    // Error de conexion
    const [connectionError, setConnectionError] = useState("");

    // Registro de actividad
    const [logs, setLogs] = useState([]);

    // ==========================================
    // REGISTRO DE ACTIVIDAD
    // ==========================================

    const addLog = useCallback((message, level = "info") => {

        const entry = {
            id: `${Date.now()}-${Math.random()}`,
            message,
            level,
            time: new Date().toLocaleTimeString("es-AR"),
        };

        setLogs((currentLogs) => [
            entry,
            ...currentLogs,
        ].slice(0, 10));

    }, []);

    // ==========================================
    // CONSULTAR ESTADO HTTP
    // ==========================================

    const refreshStatus = useCallback(async () => {

        try {

            const response = await fetch(
                `${CNC_CONFIG.HTTP_URL}/api/status`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            setDeviceStatus(data);

            addLog(
                "Estado de la CNC actualizado correctamente",
                "success"
            );

            return data;

        } catch (error) {

            addLog(
                `Error consultando HTTP: ${error.message}`,
                "error"
            );

            throw error;

        }

    }, [addLog]);

    // ==========================================
    // CONECTAR WEBSOCKET
    // ==========================================

    const connect = useCallback(() => {

        const currentSocket = socketRef.current;

        // Evitamos conexiones duplicadas
        if (
            currentSocket &&
            (
                currentSocket.readyState === WebSocket.OPEN ||
                currentSocket.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        setConnectionStatus("connecting");
        setConnectionError("");

        addLog(
            `Conectando con ${CNC_CONFIG.WEBSOCKET_URL}...`
        );

        let socket;

        try {

            socket = new WebSocket(
                CNC_CONFIG.WEBSOCKET_URL
            );

        } catch (error) {

            setConnectionStatus("error");
            setConnectionError(error.message);

            addLog(
                `No se pudo crear el WebSocket: ${error.message}`,
                "error"
            );

            return;

        }

        socketRef.current = socket;

        // ----------------------------------------
        // CONEXION ESTABLECIDA
        // ----------------------------------------

        socket.onopen = () => {

            setConnectionStatus("connected");
            setConnectionError("");

            addLog(
                "Conexion WebSocket establecida",
                "success"
            );

            // Consultamos el estado HTTP
            refreshStatus().catch(() => { });

        };

        // ----------------------------------------
        // MENSAJES RECIBIDOS
        // ----------------------------------------

        socket.onmessage = (event) => {

            let message;

            try {

                message = JSON.parse(event.data);

            } catch {

                message = {
                    type: "TEXT",
                    message: event.data,
                };

            }

            setLastMessage(message);

            switch (message.type) {

                case "WELCOME":

                    addLog(
                        "El ESP32 confirmo su disponibilidad",
                        "success"
                    );

                    break;

                case "PONG":

                    addLog(
                        "PONG recibido: comunicacion confirmada",
                        "success"
                    );

                    break;

                case "ERROR":

                    addLog(
                        `Error del ESP32: ${message.message}`,
                        "error"
                    );

                    break;

                default:

                    addLog(
                        `Mensaje recibido: ${event.data}`
                    );

                    break;


                case "ACK":

                    addLog(
                        `ESP32 acepto el comando: ${message.command}`,
                        "success"
                    );

                    break;

                case "MOTION_COMPLETED":
                    setDeviceStatus((current) => {

                        if (!current) return current;

                        return {
                            ...current,

                            ...(message.axis === "X" && {
                                positionX: message.position,
                                movingX: false,
                            }),

                            ...(message.axis === "Y" && {
                                positionY: message.position,
                                movingY: false,
                            }),
                        };

                    });

                    addLog(
                        `Movimiento finalizado: eje ${message.axis}`,
                        "success"
                    );

                    break;

                case "POSITION":

                    addLog(
                        "Posicion del motor actualizada",
                        "info"
                    );

                    break;

                case "STOPPED":
                    setDeviceStatus((current) => {

                        if (!current) return current;

                        return {
                            ...current,
                            positionX: message.positionX,
                            positionY: message.positionY,
                            movingX: false,
                            movingY: false,
                        };

                    });

                    addLog(
                        "Movimiento detenido por el ESP32",
                        "warning"
                    );

                    break;
            }

        };

        // ----------------------------------------
        // ERROR DE CONEXION
        // ----------------------------------------

        socket.onerror = () => {

            setConnectionError(
                "No se pudo establecer la conexion WebSocket. Verifica la red CNC-ESP32."
            );

            addLog(
                "Se produjo un error en WebSocket",
                "error"
            );

        };

        // ----------------------------------------
        // CONEXION CERRADA
        // ----------------------------------------

        socket.onclose = (event) => {

            if (socketRef.current === socket) {
                socketRef.current = null;
            }

            setConnectionStatus("disconnected");

            if (event.code === 1000) {

                addLog(
                    "Conexion WebSocket cerrada"
                );

            } else {

                addLog(
                    `Conexion cerrada. Codigo: ${event.code}`,
                    "warning"
                );

            }

        };

    }, [addLog, refreshStatus]);

    // ==========================================
    // DESCONECTAR
    // ==========================================

    const disconnect = useCallback(() => {

        const socket = socketRef.current;

        if (!socket) {
            setConnectionStatus("disconnected");
            return;
        }

        addLog("Desconectando de la CNC...");

        socket.close(
            1000,
            "Desconexion solicitada desde la web"
        );

    }, [addLog]);

    // ==========================================
    // ENVIAR PING
    // ==========================================

    const sendPing = useCallback(() => {

        const socket = socketRef.current;

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {

            addLog(
                "No se puede enviar PING: WebSocket desconectado",
                "warning"
            );

            return;

        }

        socket.send("PING");

        addLog(
            "Mensaje PING enviado al ESP32",
            "info"
        );

    }, [addLog]);



    // ==========================================
    // ENVIAR COMANDOS JSON A LA CNC
    // ==========================================

    const sendCommand = useCallback((command) => {

        const socket = socketRef.current;

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {

            addLog(
                "No se puede enviar el comando: CNC desconectada",
                "warning"
            );

            return false;

        }

        try {

            const payload = JSON.stringify(command);

            socket.send(payload);

            addLog(
                `Comando enviado: ${command.type}`,
                "info"
            );

            return true;

        } catch (error) {

            addLog(
                `Error enviando comando: ${error.message}`,
                "error"
            );

            return false;

        }

    }, [addLog]);


    // ==========================================
    // LIMPIEZA AL DESMONTAR EL COMPONENTE
    // ==========================================

    useEffect(() => {

        return () => {

            if (socketRef.current) {

                socketRef.current.close(
                    1000,
                    "Aplicacion cerrada"
                );

                socketRef.current = null;

            }

        };

    }, []);

    // ==========================================
    // RETORNAR FUNCIONES Y ESTADOS
    // ==========================================

    return {

        connectionStatus,
        deviceStatus,
        lastMessage,
        connectionError,
        logs,

        connect,
        disconnect,
        sendPing,
        refreshStatus,
        sendCommand,

    };

}
