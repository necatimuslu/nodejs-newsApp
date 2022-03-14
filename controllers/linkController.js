const { Link } = require("../models/link");

exports.createLink = async (req, res) => {
  try {
    let link = await new Link({
      ...req.body,
      postedBy: req.user.userId,
    }).save();
    if (!link)
      return res.status(500).json({ error: "link not has been created" });
    res.json(link);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const getAllLinks = await Link.find()
      .populate("postedBy")
      .skip((page - 1) * perPage)
      .sort({ createdAt: -1 })
      .limit(Number(perPage));

    if (!getAllLinks)
      return res.status(400).json({ error: "Links list not found" });
    res.json(getAllLinks);
  } catch (error) {
    console.log(error);
  }
};

exports.viewCountLink = async (req, res) => {
  try {
    const linkUpdate = await Link.findById(req.params.id);
    if (!linkUpdate) return res.json({ message: "link not found" });

    linkUpdate.views += 1;
    await linkUpdate.save();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

exports.updateLike = async (req, res) => {
  try {
    const updateLike = await Link.findByIdAndUpdate(
      req.body.linkId,
      {
        $addToSet: { likes: req.user.userId },
      },
      { new: true }
    );

    res.json(updateLike);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUnLike = async (req, res) => {
  try {
    const updateUnLike = await Link.findByIdAndUpdate(
      req.body._id,
      { $pull: { likes: req.user.userId } },
      { new: true }
    );

    res.json(updateUnLike);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteLink = (req, res) => {
  try {
    Link.findByIdAndRemove(req.params.id)
      .then((l) => {
        if (l) return res.status(200).json({ success: true });
        else return res.status(400).json({ message: "link silinemedi" });
      })
      .catch((err) => {
        return res.json({ error: err });
      });
  } catch (error) {}
};

exports.totalLinkCount = async (req, res) => {
  try {
    const count = await Link.countDocuments((count) => count);
    res.json({ count: count });
  } catch (error) {
    console.log(error);
  }
};
