function DashboardCard({ title, value, icon, color = "bg-orange-500" }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-orange-100 dark:border-slate-700 p-6 flex items-center justify-between hover:shadow-lg transition">
            <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {title}
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {value !== undefined ? value : "0"}
                </h2>
            </div>
            {icon && (
                <div className={`p-4 rounded-2xl text-white ${color} shadow-md`}>
                    {icon}
                </div>
            )}
        </div>
    );
}

export default DashboardCard;
