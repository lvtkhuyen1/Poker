var ELabelAlignType = Object.freeze({"Center":0, "Left":1, "Right":2});

export default class IUILabel{

    constructor(x, y, width, height, term, sprite, cSpriteWidth, cSpriteHeight, strCaption, alignType, eState)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.iSpriteWidth = cSpriteWidth;
        this.iSpriteHeight = cSpriteHeight;
        this.strCaption = strCaption;
        this.iStepTerm = term;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = width;
        this.iCurrentHeight = width;
        this.iCurrentStepTerm = term;

        this.eAlignType = alignType;
        this.eState = eState;

        this.iCurrentLength = (strCaption.length * width) - ((width-term) * (strCaption.length-1));
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.width * fHR;
        this.iCurrentHeight = this.height * fVR;

        this.iCurrentStepTerm = this.iStepTerm * fHR;

        // console.log('label');
        // alert((this.strCaption.length * this.width));
        // alert((this.width-this.iCurrentStepTerm));
        // alert(((this.width-this.iCurrentStepTerm) * (this.strCaption.length-1)));

        this.iCurrentLength = (this.strCaption.length * this.iCurrentWidth) - ((this.iCurrentWidth-this.iCurrentStepTerm) * (this.strCaption.length-1));// * fHR;
    }

    SetLocation(x, y)
    {
        this.x = x;
        this.y = y;

        this.iCurrentX = x;
        this.iCurrentY = y;
    }

    Render(ctx) {
        if(this.eState == 1)
        {
            for (var i = 0; i < this.strCaption.length; ++i) {
                let char = this.strCaption[i];
                let current_x = 0;
                let spriteIndex;

                if (char == 'X') {
                    spriteIndex = 10; // 10 �ε��� X
                } else {
                    spriteIndex = parseInt(char);
                }

                if (this.eAlignType == ELabelAlignType.Center) {
                    current_x = this.iCurrentX - (this.iCurrentLength / 2) + (i * this.iCurrentStepTerm);
                } else if (this.eAlignType == ELabelAlignType.Left) {
                    current_x = this.iCurrentX + (i * this.iCurrentStepTerm);
                } else if (this.eAlignType == ELabelAlignType.Right) {
                    current_x = this.iCurrentX - this.iCurrentLength + (i * this.iCurrentStepTerm);
                }

                ctx.drawImage(this.sprite[spriteIndex], 0, 0, this.iSpriteWidth, this.iSpriteHeight, current_x, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
            }
        }
        else
        {
            let additionalStep = 0; // �޸��� ��Ÿ�� �� �߰����� ���� ������ ���� ����
        
            for (var i = 0; i < this.strCaption.length; ++i) {
                let current_x = 0;
                let char = this.strCaption[i];
                let spriteIndex;
        
                if (char == ',') {
                    spriteIndex = 10; // �޸� ��������Ʈ �ε���
                    // �޸��� ���� ���� ������ �ٷ� ������ �� �ֵ���
                    additionalStep -= 5; // �� ���� �޸� �̹����� ũ�⿡ ���� �����ؾ� ��
                } else {
                    spriteIndex = parseInt(char);
                }
        
                if (this.eAlignType == ELabelAlignType.Center) {
                    current_x = this.iCurrentX - (this.iCurrentLength / 2) + (i * this.iCurrentStepTerm) + additionalStep;
                } else if (this.eAlignType == ELabelAlignType.Left) {
                    current_x = this.iCurrentX + (i * this.iCurrentStepTerm) + additionalStep;
                } else if (this.eAlignType == ELabelAlignType.Right) {
                    current_x = this.iCurrentX - this.iCurrentLength + (i * this.iCurrentStepTerm) + additionalStep;
                }
        
                ctx.drawImage(this.sprite[spriteIndex], 0, 0, this.iSpriteWidth, this.iSpriteHeight, current_x, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
        
                // �޸��� �׸� �� additionalStep�� ������Ʈ�Ͽ� ���� ���ڵ� ������ ����
                if (char == ',') {
                    additionalStep -= 5; // ���� ���ڵ��� ������ ����
                }
            }
        }
    }
    UpdateCaption(strCaption) {
        this.strCaption = strCaption;

        if(this.eState == 1)
        {
            this.iCurrentLength = (this.strCaption.length * this.iCurrentWidth) - ((this.iCurrentWidth-this.iCurrentStepTerm) * (this.strCaption.length-1));
        }
        else
        {
            // let commaCount = (this.strCaption.match(/,/g) || []).length;
            // let commaAdjustment = 10; // �޸� �� �� �� ������ �󸶳� ���� ������

            this.iCurrentLength = (this.strCaption.length * this.iCurrentWidth) - ((this.iCurrentWidth-this.iCurrentStepTerm) * (this.strCaption.length-1));// * fHR;
            // �⺻ ���� ��꿡 �޸� ���� ������ �߰�
            // this.iCurrentLength = (this.strCaption.length * this.iCurrentWidth) -
            //     ((this.iCurrentWidth - this.iCurrentStepTerm) * (this.strCaption.length - 1)) -
            //     (commaAdjustment * commaCount); // ���⿡ �޸� �������� ����
        }
    }
}