import API from "./api";

export const askAI = async (message) => {

    const res = await API.post("/ai", {
        message
    });

    return res.data.reply;
};