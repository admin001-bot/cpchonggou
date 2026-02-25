<?php header('content-Type: text/html;charset=utf-8'); ?>

<ion-view view-title="錢包地址" ng-init="bankInit();">
    <ion-nav-buttons side="left">
        <a class="button button-icon icon-prepage" ng-click="back();"></a>
    </ion-nav-buttons>
    <ion-content class="m-center m-info m-bank">
        <div class="padding" style="" ng-if="step==0">
            <a class="button button-block button-addbank ng-binding" ng-click="addBank()">新增提款地址</a>
        </div>
       
        <div class="padding" ng-if="step==2 || step==3">
            <form name="mdfBankForm" novalidate ng-submit="mdfBankForm.$valid ? mdfBank(mdfBankData) : 'return false'">
                <div class="list">
                    <!-- 修改后的部分 -->
                    <label class="item item-select" for="bankId" data-tap-disabled="true">
                        <select id="bankId" name="bankId" ng-model="mdfBankData.bankId" required>
                            <option value="" selected="selected">請選擇加密貨幣協議</option>
                            <?php
                            $data = $this->getRows("select * from {$this->prename}bank_list where isDelete=0 order by sort asc");
                            foreach ($data as $key => $var) {
                            ?>
                                <option value="<?=$var['id']?>"><?=$var['name']?></option>
                            <?php 
                            } ?>
                        </select>
                    </label>
                    <p class="item-warn text-assertive" ng-show="(mdfBankForm.$submitted || mdfBankForm.bankId.$touched) && (mdfBankForm.bankId.$error.required)">*請選擇加密貨幣協議</p>

                    <div class="item item-input">
                        <input ng-if="step==2" type="text" name="address" ng-model="mdfBankData.address" placeholder="請輸入提款地址" required ng-pattern="/^\S{1,300}$/" class="reset-field" />
                        <input ng-if="step==3" type="text" name="address" ng-model="mdfBankData.address" placeholder="{{mdfBankData.addressTip}}" required ng-pattern="/^\S{1,300}$/" class="reset-field" />
                    </div>
                    <p class="item-warn2 text-assertive" ng-show="(mdfBankForm.$submitted || mdfBankForm.address.$touched) && mdfBankForm.address.$error.required">*請填寫請輸入自訂錢包名稱</p>
                    <p class="item-warn2 text-assertive" ng-show="(mdfBankForm.$submitted || mdfBankForm.address.$touched) && mdfBankForm.address.$error.pattern">*請填寫請輸入自訂錢包名稱</p>
                    
                    <div class="item item-input">
                        <input ng-if="step==2" type="text" class="uc-set-scroll reset-field" name="cardNo" ng-model="mdfBankData.cardNo" placeholder="請輸入自訂錢包名稱" required  />
                        <!--ng-pattern="/^[0-9]{1,300}$/"-->
                        <input ng-if="step==3" type="text" class="uc-set-scroll reset-field" name="cardNo" ng-model="mdfBankData.cardNo" placeholder="{{mdfBankData.cardNoTip}}" required />
                        <!--ng-pattern="/^[0-9]{1,300}$/" -->
                    </div>
                    <p class="item-warn2 text-assertive" ng-show="(mdfBankForm.$submitted || mdfBankForm.cardNo.$touched) && (mdfBankForm.cardNo.$error.required)">*請填寫請輸入提款地址</p>
                    <p class="item-warn2 text-assertive" ng-show="(mdfBankForm.$submitted || mdfBankForm.cardNo.$touched) && (mdfBankForm.cardNo.$error.pattern)">*請填寫請輸入提款地址</p>
                </div>
                <button type="submit" ng-disabled="mdfBankForm.$invalid" class="button button-block button-positive" ng-click="bindBank()">確定</button>
            </form>
        </div>
        <div class="list list-bank" ng-if="step==1">
            <div class="item item-avatar bank-round">
                <div class="row">
                    <div class="col col-33">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a ng-click="setStep(3);"><img src="/images/icon-modify.png"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p>
                            <span>開戶姓名</span>： <span>{{My.getFullName()}}</span>
                        </p>
                        <p>
                            <span>錢包名稱</span>： <span>{{My.getBank().cardNo}}</span>
                        </p>
                        <p>
                            <span>提款地址</span>： <span>{{ My.getBank().subAddress.slice(0, 4) + '*****' + My.getBank().subAddress.slice(-4) }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
    <script id="realname-template" type="text/ng-template">
        <div class="info-mdf-tip">請務必填寫真實姓名(<span class="text-assertive">填寫後不可修改</span>)</div>
        <div class="row">
            <div class="col">
                <div class="item item-input"><input type="text" class="txt-info reset-field" name="realname" ng-model="modalData.realname" ng-pattern="/[\u4e00-\u9fa5]{2,5}$/" placeholder="真實姓名"></div>
            </div>
        </div>
    </script>
</ion-view>
