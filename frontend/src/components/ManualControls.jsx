
import { useState } from "react";

import {
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    PenTool,
    Move,
    Square,
    Zap,
    Lock,
} from "lucide-react";

export default function ManualControls({
    connectionStatus,
    onSendCommand,
}) {

    const [stepSize, setStepSize] = useState(128);
    const [speed, setSpeed] = useState(100);

    const isConnected = connectionStatus === "connected";

    // ==========================================
    // MOVIMIENTO DE EJES
    // ==========================================

    const moveAxis = (axis, direction) => {

        onSendCommand({

            type: "MOVE_RELATIVE",

            axis,

            steps: Number(stepSize) * direction,

            speed: Number(speed),

        });

    };

    // ==========================================
    // CONTROL DEL LAPIZ
    // ==========================================

    const controlPen = (position) => {

        onSendCommand({

            type: "PEN",

            position,

        });

    };

    // ==========================================
    // DETENER MOVIMIENTO
    // ==========================================

    const stopMovement = () => {

        onSendCommand({

            type: "STOP",

        });

    };

    return (

        <section className="panel manual-controls-panel">

            <div className="section-heading">

                <div>
                    <span className="eyebrow">CONTROL MANUAL</span>
                    <h2>Movimiento de la máquina</h2>
                </div>

                <div className={`manual-status ${isConnected ? "online" : ""}`}>
                    <span></span>
                    {isConnected ? "LISTA PARA RECIBIR ORDENES" : "SIN CONEXION"}
                </div>

            </div>

            <div className="manual-config">

                <div className="config-field">

                    <label htmlFor="step-size">
                        <Move size={15} />
                        Incremento por movimiento
                    </label>

                    <select
                        id="step-size"
                        value={stepSize}
                        onChange={(event) => setStepSize(Number(event.target.value))}
                    >
                        <option value={32}>32 pasos</option>
                        <option value={128}>128 pasos</option>
                        <option value={256}>256 pasos</option>
                        <option value={512}>512 pasos</option>
                    </select>

                </div>

                <div className="config-field">

                    <label htmlFor="motor-speed">
                        <Zap size={15} />
                        Velocidad solicitada
                    </label>

                    <select
                        id="motor-speed"
                        value={speed}
                        onChange={(event) => setSpeed(Number(event.target.value))}
                    >
                        <option value={50}>50 pasos/segundo</option>
                        <option value={100}>100 pasos/segundo</option>
                        <option value={150}>150 pasos/segundo</option>
                    </select>

                </div>

            </div>

            <div className="manual-grid">

                {/* EJE XY */}

                <div className="manual-module">

                    <div className="manual-module-title">
                        <div className="module-icon xy-icon">
                            <Move size={18} />
                        </div>

                        <div>
                            <h3>Movimiento XY</h3>
                            <span>Control direccional</span>
                        </div>
                    </div>

                    <div className="direction-pad">

                        <div className="direction-row">
                            <button
                                type="button"
                                className="direction-button"
                                onClick={() => moveAxis("Y", 1)}
                                disabled={!isConnected}
                                aria-label="Mover eje Y positivo"
                            >
                                <ArrowUp size={22} />
                            </button>
                        </div>

                        <div className="direction-row">

                            <button
                                type="button"
                                className="direction-button"
                                onClick={() => moveAxis("X", -1)}
                                disabled={!isConnected}
                                aria-label="Mover eje X negativo"
                            >
                                <ArrowLeft size={22} />
                            </button>

                            <div className="direction-center">
                                <Move size={21} />
                            </div>

                            <button
                                type="button"
                                className="direction-button"
                                onClick={() => moveAxis("X", 1)}
                                disabled={!isConnected}
                                aria-label="Mover eje X positivo"
                            >
                                <ArrowRight size={22} />
                            </button>

                        </div>

                        <div className="direction-row">
                            <button
                                type="button"
                                className="direction-button"
                                onClick={() => moveAxis("Y", -1)}
                                disabled={!isConnected}
                                aria-label="Mover eje Y negativo"
                            >
                                <ArrowDown size={22} />
                            </button>
                        </div>

                    </div>

                    <p className="module-hint">
                        Cada pulsación realiza un movimiento incremental.
                    </p>

                </div>

                {/* EJE Z / LAPIZ */}

                <div className="manual-module">

                    <div className="manual-module-title">

                        <div className="module-icon z-icon">
                            <PenTool size={18} />
                        </div>

                        <div>
                            <h3>Control del lápiz</h3>
                            <span>Movimiento del servo Z</span>
                        </div>

                    </div>

                    <div className="pen-controls">

                        <button
                            type="button"
                            className="pen-button pen-up"
                            onClick={() => controlPen("UP")}
                            disabled={!isConnected}
                        >
                            <ArrowUp size={19} />
                            Levantar lápiz
                        </button>

                        <button
                            type="button"
                            className="pen-button pen-down"
                            onClick={() => controlPen("DOWN")}
                            disabled={!isConnected}
                        >
                            <ArrowDown size={19} />
                            Bajar lápiz
                        </button>

                    </div>

                    <p className="module-hint">
                        Las posiciones del servo serán calibradas desde el firmware.
                    </p>

                </div>

            </div>

            {/* STOP */}

            <div className="manual-footer">

                <div className="manual-warning">
                    <Lock size={16} />
                    <span>
                        Los controles requieren una conexión WebSocket activa.
                    </span>
                </div>

                <button
                    type="button"
                    className="stop-button"
                    onClick={stopMovement}
                    disabled={!isConnected}
                >
                    <Square size={15} fill="currentColor" />
                    DETENER MOVIMIENTO
                </button>

            </div>

        </section>

    );

}
