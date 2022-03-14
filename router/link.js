const router = require("express").Router();

const {
  createLink,
  getAllLinks,
  viewCountLink,
  updateLike,
  updateUnLike,
  deleteLink,
  totalLinkCount,
} = require("../controllers/linkController");
const { authCheck } = require("../controllers/user");

router.get("/getAllLink/:page", getAllLinks);
router.get("/get/total", totalLinkCount);
router.post("/create", authCheck, createLink);
router.put("/view-update/:id", viewCountLink);
router.put("/like-update", authCheck, updateLike);
router.put("/unlike-update", authCheck, updateUnLike);
router.delete("/delete/:id", authCheck, deleteLink);
module.exports = router;
