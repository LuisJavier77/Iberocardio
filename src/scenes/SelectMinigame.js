import Phaser from 'phaser'

import { Choking } from '../consts/SceneKeys'
import { LateralPosition } from '../consts/SceneKeys'
import { RCP } from '../consts/SceneKeys'
import { DEA } from '../consts/SceneKeys'


export default class SelectMinigame extends Phaser.Scene
{
    preload()
    {

    }

    create()
    {
        var LateralPositionGame = this.add.text(960, 200, '1 - Posición lateral de seguridad (PLS)', {fontSize: 40})
        LateralPositionGame.setOrigin(0.5, 0.5)
        const RcpGame = this.add.text(960, 300, '2 - RCP', {fontSize: 40})
        RcpGame.setOrigin(0.5, 0.5)
        const DeaGame = this.add.text(960, 400, '3 - Desfibrilador', {fontSize: 40})
        DeaGame.setOrigin(0.5, 0.5)
        const ChokingGame = this.add.text(960, 500, '4 - Atragantamiento', {fontSize: 40})
        ChokingGame.setOrigin(0.5, 0.5)

        this.input.keyboard.on('keydown-ONE', () => {
            this.scene.start(LateralPosition)
        })

        this.input.keyboard.on('keydown-TWO', () => {
             this.scene.start(RCP)
        })

        this.input.keyboard.on('keydown-THREE', () => {
            this.scene.start(DEA)
        })

        this.input.keyboard.on('keydown-FOUR', () => {
            this.scene.start(Choking)
        })
    }
}