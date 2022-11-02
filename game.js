kaboom({
    global: true,
    fullscreen: true,
    scale: 1.7,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

// Lógica do Jogo

let isJumping = true
let isBig = false

loadRoot('https://i.imgur.com/')

loadSprite('coin', 'wbKxhcd.png') //moeda
loadSprite('evil-shroom', 'KPO3fR9.png') //goomba
loadSprite('brick', 'pogC9x5.png') //tijolo
loadSprite('block', 'M6rwarW.png') //bloco
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png') //surpresa
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

loadSprite('mario', 'OzrEnBy.png', {
    sliceX: 3.9,
    anims: {
        idle: {
            from: 0,
            to: 0,
        },
        move: {
            from: 1,
            to: 2
        },
    },
});

scene("game", ({level, score, big}) => {
        layers(['bg', 'obj', 'ui'], 'obj')
    
        const maps = [
            [
                '~                                      ~',
                '~                                      ~',
                '~                                      ~',
                '~                                      ~',
                '~                                      ~',
                '~       %   =*=%=                      ~',
                '~                                      ~',
                '~                            -+        ~',
                '~                  ^   ^     ()        ~',
                '===============================   ======',
            ],
            [
                '/                                      /',
                '/                                      /',
                '/                                      /',
                '/                                      /',
                '/                                      /',
                '/                                      /',
                '/     %!%                              /',
                '/                       x x            /',
                '/                     x x x x    -+    /',
                '/            z   z  x x x x x x  ()    /',
                '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
            ],
            [
                '                                        ',
                '                             !          ',
                '                            %%%%%%      ',
                '                     !                  ',
                '             %%%    %%%%%               ',
                '      %%%                               ',
                '                                        ',
                '                                        ',
                '     !    !   =  ^  ^     =    =         ',
                '===========================    =========/',
                '                          =    =        /',
                '                                        /',
                '        !                               /',
                '      %*%                               /',
                ' -+                                     /',
                ' ()!         !                         z/',
                '!!!!!!!!!!!!!!!!!    !!!!!!!!!!!!!!!!!!!!!',
              ],
              [
                '~                                       ~',
                '~                                       ~',
                '~                                       ~',
                '~                                       ~',
                '~                                       ~',
                '~      ==%==          ~                ~',
                '~                   ~  ~  ~             ~',
                '~                ~  ~  ~  ~  ~   -+     ~',
                '~                ~  ~  ~  ~  ~   ()     ~',
                '=========================================',
              ],

    ]

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '#': [sprite('mushroom'), body(), 'mushroom'],
        '^': [sprite('evil-shroom'), 'dangerous'],
        '~': [sprite('brick'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '/': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), body(), scale(0.5), 'dangerous'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(maps[level], levelConfig)

    const scoreLabel = add([
        text('Moedas: ' +score, 10),
        pos(30, 6),
        layer('ui'),
        {
        value: score
        }
    ])

    add([text('Level: ' +parseInt(level + 1), 10), pos(30,30)])

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
        sprite('mario', {
        animSpeed: 0.1,
        frame: 0  
        }),
        solid(),
        pos(50, 0),
        body(),
        big(),
        origin('bot'),
        {
            speed: 120
        }
    ])

    if(isBig){
        player.biggify()
    }

    //Animação do Mario
    keyDown('left', () => {
        player.flipX(true)
        player.move(-120,0)

    })

    keyDown('right', () => {
        player.flipX(false)
        player.move(120,0)
    })

    keyRelease('left', () =>{
        player.play('idle')
    })

    keyRelease('right', () =>{
        player.play('idle')
    })

    keyPress('space', () => {
        if(player.grounded()){
            player.jump(400)
            isJumping = true
        }
    })

    keyPress('left', () => {
        player.flipX(true)
        player.play('move')
    })

    keyPress('right', () => {
        player.flipX(false)
        player.play('move')
    })

    //Ações
    action('mushroom', (obj) => {
        obj.move(20,0)
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

    //Colisões
    player.collides('mushroom', (obj) => {
        destroy(obj)
        player.biggify()
    })

    player.collides('dangerous', (obj) => {
        if(isJumping){
            destroy(obj)
        }else if(isBig){
            player.smallify()
        }else{
            go("lose", ({score: scoreLabel.value}))
        }
    })  

    player.collides('coin', (obj) => {
        destroy(obj)
        scoreLabel.value++
        scoreLabel.text = 'Moedas: ' +scoreLabel.value
    })

    player.collides('pipe', () => {
        keyPress('down', () =>{
            go("game", {
                level: (level + 1) % maps.length,
                score: scoreLabel.value,
                Big: isBig
            })
        })
    })

})

scene("lose", ({ score }) => {
add([text('score: ' +score, 18), origin('center'), pos(width()/2, height()/2)])
    keyPress('space', () => {
    go("game", {level: 0, score: 0, big: isBig})
    })
})

go("game", ({level: 0, score: 0, big: isBig}))