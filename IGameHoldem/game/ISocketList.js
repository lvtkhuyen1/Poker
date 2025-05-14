class ISocketList
{
    constructor()
    {
        this.listSockets = [];
    }

    Add(socket)
    {
        console.log(`ISocketList::Add => ${socket.id}`);

        this.listSockets.push(socket);

        console.log(`ISocketList::Add Complete : ${this.listSockets.length}`);
    }

    Remove(socket)
    {
        console.log(`ISocketList::Remove => ${socket.id}`);
        console.log(socket.strID);

        for ( let i in this.listSockets )
        {
            if ( this.listSockets[i].id == socket.id ) {

                this.listSockets.splice(i, 1);

                console.log(`ISocketList::Remove Complete : ${this.listSockets.length}`);
            }                
        }
    }

    GetLength()
    {
        return this.listSockets.length;
    }

    GetSocket(i)
    {
        return this.listSockets[i];
    }

    PrintList(comment)
    {
        for ( let i in this.listSockets )
        {
            console.log(`${comment} : ${this.listSockets[i].strID} / ${this.listSockets[i].strPassword}, OnStage : ${this.listSockets[i].eStage}`);
        }
        console.log(`${comment} list length : ${this.GetLength()}`);
    }
}
module.exports = ISocketList;