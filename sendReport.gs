function sendReport(){
  var ui = SpreadsheetApp.getUi();
  var password = ui.prompt("Password: ");
  if (password.getResponseText() == "password"){
    var nownow = SpreadsheetApp.getActive()
    var date_string = nownow.getRange("H2").getValue();
    var final_row = nownow.getRange("H3").getValue();
    var recipients = nownow.getRange("H4").getValue();
    Logger.log(date_string);
    Logger.log(final_row);
    Logger.log(recipients);
    // var result = ui.prompt("What is the name of the Google Tab you'd like to include");
    // var date_string = result.getResponseText();
    var name = "Raising Kanan Daily Testing - " + date_string;    

    // var final_row_raw = ui.prompt("Which is the final row you'd like to send?");
    // var final_row = final_row_raw.getResponseText();

    // var recipients_raw = ui.prompt("Who would you like your recipients to be?");
    // var recipients = recipients_raw.getResponseText();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(date_string).activate();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var id = ss.getSheetId();
    
    const url = "https://docs.google.com/spreadsheets/d/1PS3ao7uu41QFPecOw95UoQ_Hf2wzO0wigNgA7lNM-Mc/export?";
    const exportOptions =
       'exportFormat=pdf&format=pdf' + // export as pdf
       '&size=letter' + // paper size letter / You can use A4 or legal
       '&portrait=false' + // orientation portal, use false for landscape
       '&fitw=true' + // fit to page width false, to get the actual size
       '&sheetnames=false&printtitle=false' + // hide optional headers and footers
       '&pagenumbers=false&gridlines=false' + // hide page numbers and gridlines
       '&fzr=true' + // do not repeat row headers (frozen rows) on each page
       '&gid='+ id + // the sheet's Id. Change it to your sheet ID.
       // Here is the part for selecting range to export to PDF
       '&ir=false' +  //seems to be always false
       '&ic=false' +  //same as ic
       '&r1=0' +      //Start Row number - 1, so row 1 would be 0 , row 15 wold be 14
       '&c1=2' +      //Start Column number - 1, so column 1 would be 0, column 8 would be 7   
       '&r2=' + final_row +     //End Row number
       '&c2=12';       //End Column number  THIS IS COLUMN "L"
    var params = {method:"GET",headers:{"authorization":"Bearer "+ ScriptApp.getOAuthToken()}};
  
    // Generate the PDF file
    var response = UrlFetchApp.fetch(url+exportOptions, params).getBlob();
    var message = {
          to: recipients,
          subject: "Raising Kanan | Daily Testing Schedule " + date_string,
          body: "Hello,\n\nAttached, please find the Daily Testing Schedule for " + date_string + "/2021." + "\n\nThank you\n",
          name: "Raising Kanan Health Safety",
          attachments: [{
            fileName: name + ".pdf",
            content: response.getBytes(),
            mimeType: "application/pdf"
          }]}  
  
    var ynbutton = ui.alert("Are you sure you want to send the email? It's your last chance!", ui.ButtonSet.YES_NO);
    // var ynanswer = ynbutton.getSelectedButton();
    Logger.log(ynbutton);
    // Logger.log(ynanswer);
    
    if (ynbutton == ui.Button.YES){
      MailApp.sendEmail(message);
      DriveApp.createFile(response.setName(name + ".pdf"));
    } else{Logger.log(ynbutton);}
  }
  else{
    Logger.log("Password incorrect")}
}
