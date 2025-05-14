// let OnClickLogout = (lobby) => {

//     console.log('OnClickLogout');
//     location.href = '/';

//     soundClick.play();
// }

// let OnClickJoin = (lobby) => {

//     console.log('OnClickJoin');
//     lobby.socket.emit('CM_EnterGame');

//     soundClick.play();
// }

// let OnClickQuickJoin = (lobby) => {

//     //let data = {strID:lobby.socket.strID, iDefaultCoin:lobby.iDefaultCoin};

//     let iBuyIn = parseInt(lobby.iDefaultCoin) * 100;

//     let data = {
//         strID:lobby.socket.strID, 
//         iDefaultCoin:lobby.iDefaultCoin, 
//         strRoomName:'', 
//         strPassword:'', 
//         iBuyIn:iBuyIn,
//         iBettingTime:0,
//         iNumPlayers:0,
//     };

//     console.log(data);

//     lobby.socket.emit('CM_QuickJoin', data);

//     soundClick.play();
// }

// let OnClickMakeRoom = (lobby) => {

//     // let data = {strID:lobby.socket.strID, iDefaultCoin:lobby.iDefaultCoin};

//     // console.log(data);

//     // lobby.socket.emit('CM_QuickJoin', data);

//     // console.log(`click make room`);

//     // $('#dlg_makeroom').show();

//     // soundClick.play();

//     let tag = `
//     <div id="dlg_makeroom" style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); width: 845px; height: 708px; text-align: center;">

//     <div>

//         <img src="htmlimg/makeroom.png" alt="makeroom">     

//         <div style="position:absolute; width:360px; height: 40px; left: 365px; bottom: 536px; border: 1px solid rgba(255, 255, 255, 0);">
//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice1" name="makeroom_blind" value="1000">
//                 <label for="contactChoice1">1K</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice2" name="makeroom_blind" value="2000">
//                 <label for="contactChoice2">2K</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_blind" value="3000">
//                 <label for="contactChoice3">3K</label>
//             </div>                   
//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_blind" value="4000">
//                 <label for="contactChoice3">4K</label>
//             </div>                   
//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_blind" value="5000">
//                 <label for="contactChoice3">5K</label>
//             </div>                   
//     	</div>

//         <input type="text" style="position:absolute; width:306px; height: 40px;left: 390px;bottom: 472px; background-color: transparent;
//         border: 1px solid rgba(255, 255, 255, 0); padding-top: 4px; color: rgb(255, 255, 255); font-size: 19px; text-align: center;" id='makeroom_roomname'>

//         <input type="password" style="position:absolute; width:306px; height: 40px;left: 390px;bottom: 410px; background-color: transparent;
//         border: 1px solid rgba(255, 253, 255, 0); padding-top: 4px; color: rgb(255, 255, 255); font-size: 19px; text-align: center;" id='makeroom_password'>

//         <div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 350px; border: 1px solid rgba(255, 255, 255, 0);">
//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice1" name="makeroom_numplayers" value="3">
//                 <label for="contactChoice1">3명</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice2" name="makeroom_numplayers" value="5">
//                 <label for="contactChoice2">5명</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_numplayers" value="8">
//                 <label for="contactChoice3">8명</label>
//             </div>                   
//         </div>

//         <div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 290px; border: 1px solid rgba(255, 255, 255, 0);">
//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice1" name="makeroom_bettingtime" value="10">
//                 <label for="contactChoice1">10초</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice2" name="makeroom_bettingtime" value="20">
//                 <label for="contactChoice2">20초</label>
//             </div>

//             <div style="display:inline-block; width: 60px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_bettingtime" value="30">
//                 <label for="contactChoice3">30초</label>
//             </div> 
//         </div>

//         <div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 232px; border: 1px solid rgba(255, 255, 255, 0);">
//             <div style="display:inline-block; width: 100px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice1" name="makeroom_buyin" value="100000">
//                 <label for="contactChoice1">100K</label>
//             </div>

//             <div style="display:inline-block; width: 100px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice2" name="makeroom_buyin" value="200000">
//                 <label for="contactChoice2">200K</label>
//             </div>

//             <div style="display:inline-block; width: 100px; font-size: 19px; padding-top: 5px; color: aliceblue;">
//                 <input type="radio" id="contactChoice3" name="makeroom_buyin" value="300000">
//                 <label for="contactChoice3">300K</label>
//             </div>        
        
//         </div>

//         <span style="position:absolute; width:306px; height: 40px;left: 393px; bottom: 170px;
//         border: 1px solid rgba(255, 255, 255, 0); padding-top: 4px; color: rgb(255, 255, 255); font-size: 19px; text-align: center;">바이인</span>
     
//         <div style="position:absolute; width:520px; height: 74px; left: 154px; bottom: 40px; 
//                     text-align: center; border: 1px solid rgba(255, 255, 255, 0);">              
            
//             <button  id="button_lobby01" class="button_makeroom" style="vertical-align:top">
//             확  인</button>

//             <span style="display: inline-block; width: 40px;"></span>

//             <button id="button_lobby01" class="button_makeroom_cancel">
//             취  소</button>   
//         </div>
   
//     </div>    

// </div> 
//     `;

//     $('#html_ui').empty();
//     $('#html_ui').append(tag);
// }

// let OnClickSettingOnLobby = (lobby) => {

//     let tag = `
//     <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); width: 318px; height: 434px; text-align: center;">
//     <div>   
//         <img src="htmlimg/optionbase01.png" alt="optionbase01">     
//          <div style="position:absolute; width:200px; height: 380px; bottom: 10px; left: 20px;
//          text-align: center; border: 1px solid rgba(240, 8, 8, 0);">              
 
//             <button  id="option_btn_out01"  style="vertical-align:top"></button>   

//             <button id="option_btn_see01" style="vertical-align:top"></button>  
//             <button id="option_btn_addChip01" style="vertical-align:top"></button>  
//             <button id="option_btn_option01" style="vertical-align:top"></button>  
//             <button id="option_btn_allScreen01" style="vertical-align:top"></button>  
            
//         </div>

//         <div style="position:absolute; width:55px; height: 55px; bottom: 360px; left: 240px;
//          text-align: center; border: 1px solid rgba(240, 8, 8, 0);">                   
//             <button id="option_btn_close01" style="vertical-align:top" class="button_makeroom_cancel"></button>                      
//         </div>

//     </div>    

// </div> 
//     `;

//     $('#html_ui').empty();
//     $('#html_ui').append(tag);
// }

// let OnClickSystemOnLobby = (lobby) => {

//     let tag = `
//     <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); width: 845px; height: 708px; text-align: center;">
// 		<div>   
// 			<img src="htmlimg/option_system.png" alt="option_system">  

// 			<div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 536px; border: 1px solid rgba(255, 255, 255, 0);">
// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice1" name="system_enablebgm" value="0" checked>
// 					<label for="contactChoice1">켜 기</label>
// 				</div>

// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice3" name="system_enablebgm" value="1">
// 					<label for="contactChoice3">끄 기</label>
// 				</div>                   
// 			</div>

// 			<div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 472px; border: 1px solid rgba(255, 255, 255, 0);">
// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice1" name="system_enablesound" value="3" checked>
// 					<label for="contactChoice1">켜 기</label>
// 				</div>

// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice3" name="system_enablesound" value="8">
// 					<label for="contactChoice3">끄 기</label>
// 				</div>                   
// 			</div>

// 			<div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 410px; border: 1px solid rgba(255, 255, 255, 0);">
// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice1" name="system_fullscreen" value="3" checked>
// 					<label for="contactChoice1">켜 기</label>
// 				</div>

// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice3" name="system_fullscreen" value="8">
// 					<label for="contactChoice3">끄 기</label>
// 				</div>                   
// 			</div>

// 			  <div style="position:absolute; width:320px; height: 40px; left: 385px; bottom: 350px; border: 1px solid rgba(255, 255, 255, 0);">
// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice1" name="system_cardoccur" value="3" checked>
// 					<label for="contactChoice1">켜 기</label>
// 				</div>

// 				<div style="display:inline-block; width: 150px; font-size: 19px; padding-top: 5px; color: aliceblue;">
// 					<input type="radio" id="contactChoice3" name="system_cardoccur" value="8">
// 					<label for="contactChoice3">끄 기</label>
// 				</div>                   
// 			</div>
			
// 			<div style="position:absolute; width:400px; height: 140px; left: 340px; bottom: 190px; border: 1px solid rgba(255, 255, 255, 0);">
// 				<div style="display:inline-block; width: 92px; height: 134px; font-size: 100px; padding-top: 5px; ">
// 					<img id="system_cardSelect01" src="htmlimg/card20.png" alt="optionBase01" >                         
// 				</div>

// 				<div style="display:inline-block; width: 92px; height: 134px; font-size: 100px; padding-top: 5px;">
// 					<img id="system_cardSelect01" src="htmlimg/card20.png" alt="optionBase01" >                         
// 				</div>

// 				<div style="display:inline-block; width: 92px; height: 134px; font-size: 100px; padding-top: 5px;">
// 					<img id="system_cardSelect01" src="htmlimg/card20.png" alt="optionBase01" >                         
// 				</div> 

// 				<div style="display:inline-block; width: 92px; height: 134px; font-size: 100px; padding-top: 5px;">
// 					<img id="system_cardSelect01" src="htmlimg/card20.png" alt="optionBase01" >                         
// 				</div> 
// 			</div>

// 			<div style="position:absolute; width:520px; height: 74px; left: 154px; bottom: 40px; 
// 						text-align: center; border: 1px solid rgba(255, 255, 255, 0);">              
				
// 				<button  id="button_lobby01" style="vertical-align:top" class="button_makeroom_cancel">확  인</button>

// 				<span style="display: inline-block; width: 40px;"></span>   

// 				<button id="button_lobby01" class="button_makeroom_cancel">취  소</button>   
// 			</div>
// 		</div>    
// 	</div> 
//     `;
//     $('#html_ui').empty();
//     $('#html_ui').append(tag);
// }


// let OnClickRefresh = (lobby) => {

//     lobby.socket.emit('CM_RoomList');
// }

// let OnClickDefaultCoin1 = (lobby) => {

//     //lobby.iDefaultCoin = 1000;

//     //console.log(lobby);

//     lobby.UpdateDefaultCoin(1000);

//     //lobby.QuickJoin();
//     soundClick.play();
// }

// let OnClickDefaultCoin2 = (lobby) => {

//     lobby.UpdateDefaultCoin(2000);
//     // lobby.iDefaultCoin = 2000;

//     // console.log(lobby);

//     soundClick.play();
// }

// let OnClickDefaultCoin3 = (lobby) => {

//     lobby.UpdateDefaultCoin(3000);
//     // lobby.iDefaultCoin = 3000;
//     // console.log(lobby);

//     soundClick.play();
// }

// let OnClickDefaultCoin4 = (lobby) => {

//     lobby.UpdateDefaultCoin(4000);

//     // lobby.iDefaultCoin = 4000;
//     // console.log(lobby);

//     soundClick.play();
// }

// let OnClickDefaultCoin5 = (lobby) => {

//     lobby.UpdateDefaultCoin(5000);

//     // lobby.iDefaultCoin = 5000;
//     // console.log(lobby);

//     soundClick.play();
// }