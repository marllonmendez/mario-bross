kaboom({
    global: true,
    fullscreen: true,
    scale: 2.32,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

// Lógica do Jogo

loadRoot('https://i.imgur.com/')

loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

    scene("game", ({ score }) => {
        layers(['bg', 'obj', 'ui'], 'obj')
      
        const map = [
            '=                                      =',
            '=                                      =',
            '=                                      =',
            '=                                      =',
            '=                                      =',
            '=       %   =*=%=                      =',
            '=                                      =',
            '=                            -+        =',
            '=                  ^   ^     ()        =',
            '===============================   ======',
        ]

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '£': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(map, levelConfig)

    const scoreLabel = add([
        text('Moedas: ' +score, 10),
        pos(30, 6),
        layer('ui'),
        {
          value: score
        }
      ])
    
    //   add([text('level ' + parseInt(level + 1) ), pos(40, 6)])

    function big(){
        return{
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                isBig = false
            },
            biggify(){
                this.scale = vec2(1.5)
                isBig = true
            }
        }
    }

    const player = add([
        sprite('mario'),
        solid(),
        pos(50, 0),
        body(),
        big(),
        origin('bot')
    ])

    action('mushroom', (obj) => {
        obj.move(20,0)
    })

    keyDown('left', () => {
        player.flipX(true)
        player.move(-120,0)

    })

    keyDown('right', () => {
        player.flipX(false)
        player.move(120,0)
    })

    keyPress('space', () => {
        if(player.grounded()){
            player.jump(400)
            isJumping = true
        }
    })

    action('dangerous', (obj) => {
        obj.move(-20,0)

    })

    player.action(() => {
        if(player.grounded()){
            isJumping = false
        }
    })

    player.on('headbutt', (obj) => {
        if (obj.is('coin-surprise')){
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }

        if (obj.is('mushroom-surprise')){
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
    })

    player.collides('mushroom', (obj) => {
        destroy(obj)
        player.biggify()
    })

    player.collides('dangerous', (obj) => {
        if(isJumping){
            destroy(obj)
        }else{
            if(isBig){
                player.smallify()
            }else{
                go("lose")
            }
        }
    })

})

player.collides('coin', (obj) => {
    destroy(obj)
    scoreLabel.value++
    scoreLabel.text = 'Moedas: ' +scoreLabel.value
})


scene("lose", ({ score }) => {
    add([text('score: ' +score, 18), origin('center'), pos(width()/2, height()/2)])
})

go("game", { score: 0 })