export const timeSince = (date: string) => {
    const now = new Date();
    const nowSeconds = now.getTime();
    const dateSec = Number(date) * 1000;
    const seconds = Math.floor((nowSeconds - dateSec) / 1000);

    let interval = Math.floor(seconds / 86400);
    if (interval >= 1 && interval <= 6) {
        if (interval === 1) return `${interval} day ago`
        else return `${interval} days ago`
    } else if (interval > 6) {
        let created = new Date(dateSec);
        return created.toLocaleDateString();
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        if (interval === 1) return `${interval} hour ago`
        else return `${interval} hours ago`
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        if (interval === 1) return `${interval} minute ago`
        else return `${interval} minutes ago`
    } else if (interval < 1) return 'less than a minute ago'
}
