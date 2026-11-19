
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
} from "lucide-react";

export default function ActivityLog({ logs }) {

    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    return (

        <section className="panel activity-panel">

            <div className="section-heading">

                <div>
                    <span className="eyebrow">MONITOREO</span>
                    <h2>Registro de actividad</h2>
                </div>

                <div className="activity-heading-icon">
                    <Activity size={19} />
                </div>

            </div>

            <div className="activity-list">

                {logs.length === 0 ? (

                    <div className="empty-log">

                        <Activity size={25} />

                        <p>
                            Todavia no hay actividad registrada.
                        </p>

                        <span>
                            Los eventos de comunicacion apareceran aqui.
                        </span>

                    </div>

                ) : (

                    logs.map((log) => {

                        const Icon = icons[log.level] || Info;

                        return (

                            <div className="activity-item" key={log.id}>

                                <div className={`activity-icon ${log.level}`}>
                                    <Icon size={16} />
                                </div>

                                <div className="activity-message">
                                    <p>{log.message}</p>
                                    <span>{log.time}</span>
                                </div>

                            </div>

                        );

                    })

                )}

            </div>

        </section>

    );

}
