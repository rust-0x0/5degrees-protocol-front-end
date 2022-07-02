
import erc1155Abi from '../abi/erc1155.json';
import fiveDegrees from '../abi/five_degrees.json';
const { ContractPromise } = require('@polkadot/api-contract');



const ConnectContract = async (api,type,address) =>{
    if(!api){
      return
    }
    const abiMap ={
        erc1155:{abi:erc1155Abi, address:"5HAVUMdSY6ZnM9dBQrWEEXJPYcPbBa4DUSnj1eHzMiEVfNpr"},
        fiveDegrees:{ address : "5Gyty37NykRyDrPmLGMGu6bpFyF66KMjSCFRjzzksgRGE92h", abi : fiveDegrees}
    }

    if(abiMap[type].address){
        address = abiMap[type].address
    }
    const mainContract = new ContractPromise(api, abiMap[type].abi, address);
    return mainContract;
  }

export default ConnectContract
