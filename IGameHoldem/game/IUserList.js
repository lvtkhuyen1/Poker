let IUser = require('./IUser');

class IUserList
{
    constructor()
    {
        this.listUsers = [];
    }

    Add(user)
    {
        console.log(`IUserList::Add => ${user.socket.id}`);

        //let kUser = new IUser(user);

        this.listUsers.push(user);

        console.log(`IUserList::Add Complete : ${this.listUsers.length}`);
    }

    Remove(user)
    {
        console.log(`IUserList::Remove => ${user.socket.id}, strID : ${user.strID}`);

        for ( let i in this.listUsers )
        {
            if ( this.listUsers[i].socket.id == user.socket.id ) {

                this.listUsers.splice(i, 1);

                console.log(`IUserList::Remove Complete : ${this.listUsers.length}`);
            }                
        }
    }

    GetLength()
    {
        return this.listUsers.length;
    }

    GetUser(i)
    {
        return this.listUsers[i];
    }

    GetSocket(i)
    {
        return this.listUsers[i].socket;
    }

    PrintList(comment)
    {
        for ( let i in this.listUsers )
        {
            console.log(`${comment} : ${this.listUsers[i].strID} / ${this.listUsers[i].strPassword}, OnStage : ${this.listUsers[i].eStage}`);
        }
        console.log(`${comment} list length : ${this.GetLength()}`);
    }
}
module.exports = IUserList;