const express = require("express");
const { collection, getDocs, doc, setDoc, getDoc, updateDoc } = require("firebase/firestore/lite");
const { firestore } = require("./configs/firebase.js");

async function generateId() {
    const { nanoid } = await import("nanoid");
    return nanoid(4);
}

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const urlColRef = collection(firestore, 'urls');

app.get("/", async (req, res) => {
    res.render("cloak");
});

app.get("/q", async (req, res) => {
    const snaps = await getDocs(urlColRef);
    const shortUrls = snaps.empty ? [] : snaps.docs.map((snap) => ({...snap.data(), short: snap.id}));

    res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
    const docId = await generateId();
    const docRef = doc(urlColRef, docId);

    await setDoc(docRef, { full: req.body.fullUrl, comment:req.body.comment, clicks: 0 });
    res.redirect("/q");
});

app.get("/:shortUrl", async (req, res) => {
    const docRef = doc(urlColRef, req.params.shortUrl);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        res.sendStatus(404)
        return;
    }

    const data = snap.data();

    await updateDoc(docRef, {clicks: data.clicks + 1})

    res.redirect(data.full);
});

app.listen(process.env.PORT || 8080);
