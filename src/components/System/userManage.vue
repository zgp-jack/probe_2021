<template>
  <div class="outerbox">
    <div class="submit-but" @click="dialogTableVisible=true">增加用户</div>
    <div class="uesrtabletop">
      <div v-for="(item,index) in usertabletip" v-html="item" :key="index" class="tip"></div>
    </div>
    <div class="userlist">
      <div class="userinfo" v-for="(item, index) in $store.state.userArr" :key="index">
        <div class="flex1" v-html="item.username"></div>
        <div class="flex1" v-html="item.email"></div>
        <div class="flex1" v-html="item.nickName"></div>
        <div class="flex1" v-html="item.phone"></div>
        <div class="flex1" v-html="item.sex==1?'男':'女'"></div>
        <div class="flex1" v-html="FormatTime(item.dateAdd)"></div>
        <div class="flex1" v-html="FormatTime(item.dateModify)"></div>
        <div class="flex1 editbox deal-but-box">
          <div class="deal-but deal-edit" @click="editUser(item)">编辑</div>
          <div class="deal-but deal-delete" @click="deleteUser(item)">删除</div>
        </div>
      </div>
    </div>
    <div class="paging">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="$store.state.userTotle"
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
      ></el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="640px">
      <div class="popup">
        <div class="title">新增角色</div>
        <div class="hidepopup" @click="dialogTableVisible=!dialogTableVisible"></div>
        <div class="adduser-item">
          <span class="adduser-tip">用户名:</span>
          <input placeholder="请输入用户名" type="text" v-model="newUserObj.username" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">邮箱:</span>
          <input placeholder="请输入邮箱地址" type="text" v-model="newUserObj.email" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">电话:</span>
          <input placeholder="请输入电话号码" type="text" v-model="newUserObj.phone" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">性别:</span>
          <input placeholder="请输入性别(请输入1或者0:1代表男,0代表女)" type="text" v-model="newUserObj.sex" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">昵称:</span>
          <input placeholder="请输入昵称" type="text" v-model="newUserObj.nickName" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">角色选择:</span>
          <div class="jurisdictionbox">
            <div
              class="jurisdictionitem"
              v-for="(item,index) in $store.state.allRoleArr"
              :key="index"
              v-html="item.name"
              :class="[{onselectJurisdition:(item.id == newUserObj.roleId)}]"
              @click="selectRole(item,'add')"
            ></div>
          </div>
        </div>
        <div class="popup-buts">
          <div class="popup-but popup-but-submit" @click="submitAddUser(newUserObj,'add')">确 定</div>
          <div class="popup-but popup-but-cancel" @click="cancelAddUser">取 消</div>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :visible.sync="dialogTableVisible_edit" :close-on-click-modal="false" width="640px">
      <div class="popup">
        <div class="title">编辑角色</div>
        <div class="hidepopup" @click="dialogTableVisible_edit=!dialogTableVisible_edit"></div>
        <div class="adduser-item">
          <span class="adduser-tip">用户名:</span>
          <input
            placeholder="请输入用户名"
            type="text"
            v-model="editUserObj.username"
            disabled="disabled"
          />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">邮箱:</span>
          <input placeholder="请输入邮箱地址" type="text" v-model="editUserObj.email" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">电话:</span>
          <input placeholder="请输入电话号码" type="text" v-model="editUserObj.phone" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">性别:</span>
          <input placeholder="请输入性别(请输入1或者0:1代表男,0代表女)" type="text" v-model="editUserObj.sex" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">昵称:</span>
          <input placeholder="请输入昵称" type="text" v-model="editUserObj.nickName" />
        </div>
        <div class="adduser-item">
          <span class="adduser-tip">角色改变:</span>
          <div class="jurisdictionbox">
            <div
              class="jurisdictionitem"
              v-for="(item,index) in $store.state.allRoleArr"
              :key="index"
              v-html="item.name"
              :class="[{onselectJurisdition:(item.id == editUserObj.roleId)}]"
              @click="selectRole(item,'edit')"
            ></div>
          </div>
        </div>
        <div class="popup-buts">
          <div class="popup-but popup-but-submit" @click="submitAddUser(editUserObj,'edit')">确 定</div>
          <div class="popup-but popup-but-cancel" @click="cancelEditUser">取 消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axiosHttp from "../../js/axiosHttp.js";
import baseUrl from "../../js/baseUrl.js";
import CommonFun from "../../js/commonFun.js";
export default {
  name: "userManagement",
  components: {},
  data() {
    return {
      addUserUrl: "system/user/save",
      deleteUserUrl: "system/user/delete",
      newUserObj: { roleId: "" },
      editUserObj: {},
      dialogTableVisible: false,
      dialogTableVisible_edit: false,
      usertabletip: [
        "用户名",
        "邮箱",
        "昵称",
        "电话号码",
        "性别",
        "添加时间",
        "修改时间",
        "操作"
      ],
      currentPage: 1,
      pageSize: 3
    };
  },
  methods: {
    //时间格式化
    FormatTime(data) {
      return CommonFun.FormatTime(data);
    },
    submitAddUser(obj, kind) {
      var $this = this;
			let loading = CommonFun.openFullScreen()($this)
      axiosHttp
        .post(baseUrl.BASEURL + this.addUserUrl, obj)
        .then(function(res) {
					CommonFun.closeFullScreen(loading)
          console.log("增加user结果：");
          console.log(res);
          if (res.data.status == 1) {
            if (kind == "edit") {
              $this.$message({
                message: "编辑用户成功！",
                type: "success"
              });
              $this.cancelEditUser();
            } else {
              $this.$message({
                message: "用户添加成功！",
                type: "success"
              });
              $this.cancelAddUser();
            }
            $this.$store.dispatch("getUserData", {
              page: $this.currentPage,
              pageSize: $this.pageSize
            });
          }
        })
        .catch(function(res) {
					CommonFun.closeFullScreen(loading)
          $this.$message.error(data.message);
        });
    },
    cancelAddUser() {
      this.newUserObj = { roleId: "" };
      this.dialogTableVisible = false;
    },
    cancelEditUser() {
      this.editUserObj = {};
      this.dialogTableVisible_edit = false;
    },
    editUser(item) {
      this.editUserObj = item;
      this.dialogTableVisible_edit = !this.dialogTableVisible_edit;
    },
    deleteUser(item) {
      var $this = this;
	  let loading = CommonFun.openFullScreen()($this)
      axiosHttp
        .post(baseUrl.BASEURL + this.deleteUserUrl, { id: item.id })
        .then(function(res) {
			CommonFun.closeFullScreen(loading)
          console.log("删除user结果：");
          console.log(res);
          if (res.data.status == "1") {
            $this.$message({
              message: "用户删除成功！",
              type: "success"
            });
            // 判断当前页是不是最后一条数据，如果是且当前页大于1，则当前页减1刷新列表
            let page = $this.currentPage
            if(page > 1 && $this.listData.length === 1){
              $this.currentPage = page - 1
            }
            $this.$store.dispatch("getUserData", {
              page: $this.currentPage,
              pageSize: $this.pageSize
            });
          }
        })
        .catch(function(res) {
			CommonFun.closeFullScreen(loading)
          $this.$message.error(res.message);
        });
    },
    handleCurrentChange(val) {
      if (this.currentPage == val) {
        return;
      }
      this.currentPage = val;
      this.$store.dispatch("getUserData", {
        page: this.currentPage,
        pageSize: this.pageSize
      });
    },
    selectRole(item, type) {
      if (type == "add") {
        if (this.newUserObj.roleId == item.id) {
          this.newUserObj.roleId = "";
        } else {
          this.newUserObj.roleId = item.id;
        }
      } else if (type == "edit") {
        if (this.editUserObj.roleId == item.id) {
          this.editUserObj.roleId = "";
        } else {
          this.editUserObj.roleId = item.id;
        }
      }
    }
  },
  created: function() {
    this.$store.dispatch("getUserData", {
      page: this.currentPage,
      pageSize: this.pageSize
    });
    this.$store.dispatch("getAllRoleData", {});
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.outerbox {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 50px 57px;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.uesrtabletop {
  height: 50px;
  display: flex;
  width: auto;
}
.uesrtabletop .tip {
  font-size: 14px;
  font-weight: bolder;
}
.userlist {
  background-color: #fff;
}
.tip,
.userinfo {
  flex: 1;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #f5f5f5;
  padding: 5px 0px;
}
.userinfo {
  display: flex;
}
.userinfo div {
  text-align: center;
  font-size: 13px;
  color: #666;
}
.editbox .deal-but {
  color: #fff;
  width: 44px;
}
.adduser-item {
  margin-bottom: 15px;
}
.adduser-tip {
  line-height: 35px;
  margin-right: 5px;
  width: 80px;
  text-align: right;
  display: inline-block;
}
.adduser-item input {
  display: inline-block;
  width: 500px;
  border: 1px solid #ddd;
  padding-left: 10px;
  line-height: 35px;
}
.submit-but {
  width: 74px;
  height: 34px;
  line-height: 34px;
  color: #fff;
  background-color: #c7000b;
  text-align: center;
  font-size: 14px;
  font-weight: bolder;
  cursor: pointer;
  margin-bottom: 20px;
}
.buts {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
.buts div {
  line-height: 40px;
  padding: 0 30px;
  margin-right: 10px;
  cursor: pointer;
}
.buts .submit-but-selectParent {
  background-color: #58a7ea;
  color: #fff;
}
.buts .cancel-but-selectParent {
  background-color: #fafafa;
  color: #adadad;
}
.jurisdictionbox {
  width: 500px;
  height: auto;
  overflow: hidden;
  border: 1px solid #ddd;
  padding: 10px;
  display: inline-block;
}
.jurisdictionbox .jurisdictionitem {
  margin: 10px;
  padding: 10px;
  background-color: #adadad;
  color: #fff;
  cursor: pointer;
  width: 100px;
  float: left;
}
.jurisdictionbox .onselectJurisdition {
  background-color: #ffac5b;
}
</style>
