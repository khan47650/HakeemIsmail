export const createSlug = (text = "") => {
    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\w\s\u0600-\u06FF-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const getItemSlug = (item) => {
    if (!item) return "";
    if (item.slug && item.slug.trim()) {
        return createSlug(item.slug);
    }
    const rawTitle = item.name || item.title || "";
    const slug = createSlug(rawTitle);
    return slug || item._id || "";
};

export const matchesSlugOrId = (item, param) => {
    if (!item || !param) return false;

    let decodedParam = param;
    try {
        decodedParam = decodeURIComponent(param);
    } catch {
        decodedParam = param;
    }

    if (item._id === decodedParam) return true;
    if (item.slug && createSlug(item.slug) === createSlug(decodedParam)) return true;

    const generated = createSlug(item.name || item.title || "");
    return Boolean(generated) && generated === createSlug(decodedParam);
};