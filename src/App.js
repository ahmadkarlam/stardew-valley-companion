import React, {useState} from "react";
import database from './database.json';
import Datatable from "./datatable";
import SellItem from "./sell_item";

const parseString = require('xml2js').parseString;

function transformItemOnChest(chest) {
  chest = {
    ...chest,
    image: '',
    isSelected: 0,
    qualityId: Number(chest.quality) || 0,
  };
  chest.quality = database.quality[chest.quality] || "Regular";
  chest.image = database.images[`${chest.quality.toLowerCase()}_quality_icon`];
  chest.basePrice = Number(chest.price) || 0;
  chest.price = calculatePrice(chest.basePrice, chest.quality);
  chest.stack = Number(chest.stack) || 1;
  chest.subTotal = chest.price * chest.stack;
  return chest;
}

function calculatePrice(basePrice, quality) {
  const multiplicationFactor = database.multiplication_quality[quality];
  return Math.floor((basePrice * multiplicationFactor) + basePrice);
}

function getAndSetItemFromSaveGame(data, setItems) {
  data.SaveGame.locations.GameLocation
    .filter(gameLocation => gameLocation.objects.item)
    .filter(gameLocation => Array.isArray(gameLocation.objects.item))
    .map(gameLocation => {
      gameLocation.objects.item = gameLocation.objects.item
        .filter(item => item.value.Object.name === 'Chest')
      return gameLocation;
    })
    .filter(gameLocation => gameLocation.objects.item.length > 0)
    .forEach(gameLocation => {
      gameLocation.objects.item
        .forEach(chest => {
          if (!chest.value.Object.items) return;
          if (!Array.isArray(chest.value.Object.items.Item)) {
            setItems(x => x.concat(
              transformItemOnChest(chest.value.Object.items.Item)
            ));
            return;
          }
          setItems(x => x.concat(
            chest.value.Object.items.Item.map(transformItemOnChest)
          ));
        });
    });
}

function onChangeSaveFile(e, onLoad) {
  const reader = new FileReader();
  reader.onload = onLoad;
  reader.readAsText(e.target.files[0]);
}

function App() {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [totalSellItem, setTotalSellItem] = useState(0);

  const parseAndSetDataFromSaveFile = xmlString => {
    parseString(xmlString, {explicitArray: false}, (err, result) => {
      if (result) {
        if (!!!result.SaveGame) {
          alert('Invalid save file.');
          return;
        }
        getAndSetItemFromSaveGame(result, setItems);
        setMoney(result.SaveGame.player.money);
      }
    });
  };

  return (
    <div className="App container">
      <div className="row" style={{marginTop: 10}}>
        <div className="col-12">
          <h4>Load save file:</h4>
          <input type="file" name='save' onChange={(e) => {
            onChangeSaveFile(e, (event) => parseAndSetDataFromSaveFile(event.target.result));
          }}/>
          <p>Default save location:</p>
          <ul>
            <li>Windows: <code>%AppData%\StardewValley\Saves\</code></li>
            <li>Mac OSX & Linux: <code>~/.config/StardewValley/Saves/</code></li>
          </ul>
        </div>
        <div className="col-8">
          <Datatable
            data={items}
            onSelect={({selectedRows}) => {
              setTotalSellItem(selectedRows.reduce((total, item) => total += item.subTotal, 0));
            }}
          />
        </div>
        <div className="col">
          <SellItem money={money} totalSellItem={totalSellItem}/>
        </div>
      </div>
    </div>
  );
}

export default App;
