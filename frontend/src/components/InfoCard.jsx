
export default function InfoCard({
    title,
    value,
    description,
    icon: Icon,
    color = "blue",
    badge,
}) {

    return (

        <article className="info-card">

            <div className="info-card-header">

                <div className={`info-icon ${color}`}>
                    <Icon size={20} />
                </div>

                {badge && (
                    <span className="small-badge">
                        {badge}
                    </span>
                )}

            </div>

            <div className="info-card-content">

                <span className="info-title">
                    {title}
                </span>

                <h3>{value}</h3>

                <p>{description}</p>

            </div>

        </article>

    );

}
