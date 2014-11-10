/**
* Copyright 2014 Google Inc. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// item
function Item(id, brandId, name, subtitle, price, detail, imageurl, clientShow) {
    this.id = id;
    this.brandId = brandId;
    this.name = name;
    this.subtitle = subtitle;
    this.price = price;
    this.detail = detail;
    this.imageurl = imageurl;
    this.clientShow = clientShow;
}

Item.prototype.toString = function(){
        return 'id: ' + this.id + ' brandId: ' + this.brandId + ' name: ' + this.name;
    };

// item master
function ItemMaster(){
    this.items = new Array();
//    this.count = 0;
}

//ItemMaster.prototype.addItem = function (item) {
//    this.items.add(item);
//    this.count ++;
//};

// brand
function Brand(id, name, imageurl){
    this.id = id;
    this.name = name;
    this.imageurl = imageurl;
    this.itemMaster = new ItemMaster();
}

Brand.prototype.toString = function(){
        return 'id: ' + this.id + ' name: ' + this.name + ' imageurl: ' + this.imageurl;
    };

// brand master
function BrandMaster(){
    this.brands = new Array();
}

BrandMaster.prototype.pushItem = function(item){
    if (!(item instanceof Item)) { return; }
    for (var i=0; i<this.brands.length; i++){
        if (this.brands[i].id == item.brandId) {
            this.brands[i].itemMaster.items.push(item);
        }
    }
};


function getObjectName(object) {
            return object.find('[class$="Name"]').text();
        }