import React, { useEffect, useRef } from 'react';
import Container from "@comp/container/Container";
import Game from '../game/game';
import Navbar from '@comp/navigation/Navbar';
import styles from '@styles/global.module.scss'
import Label from '@comp/form/Label';

const GamePage = () => {
    const gameCanvas = useRef<HTMLCanvasElement>(null);
    const player1 = useRef<HTMLDivElement>(null);
    const player2 = useRef<HTMLDivElement>(null);
    const timer = useRef<HTMLDivElement>(null);
    const msg = useRef<HTMLDivElement>(null);
    const gameStartedRef = useRef(false); 

    useEffect(() => {
        const startGameOnKeyPress = (event:any) => {
            if (!gameStartedRef.current && gameCanvas.current && player1.current && player2.current && timer.current && msg.current) {
                gameStartedRef.current = true; // Mark game as started
                const game = new Game(gameCanvas.current, player1.current, player2.current, timer.current, msg.current);
                game.start();
            }
        };

        window.addEventListener('keydown', startGameOnKeyPress);

        return () => {
            window.removeEventListener('keydown', startGameOnKeyPress); // Cleanup listener
        };
    }, []);

    return (
        <Container width="100vw" height="100vh" className=" no-padding justify-center bg-notthatwhite">
            <Container width='100%' height='100%' center className='no-padding abs'>
                <Label fontSize={styles.f5xl}>
                    <div ref={msg} style={{color:'white'}}>
                    
                    </div>
                </Label>
            </Container>
            <Navbar/>
            <Container width='70%' gap={styles.g4} height='80px' className='abs no-padding push-navbar-more'>
                <Container direction='column' width='45%' height='100%' gap={styles.g1} className='no-padding'>
                    <Label className='lh' fontSize={styles.fxl} fontWeight='700' color={styles.white}>Player 1</Label>
                    <Container width='100%' height='100%' className='bg-white no-padding justify-end '>
                        <div ref={player1} style={{backgroundColor:'red', width:'100%', height:'100%'}} />
                    </Container>
                </Container>
                <Container center width='5%' height='100%' className='bg-white '>
                        <div ref={timer}>10</div>
                </Container>
                <Container direction='column' width='45%' height='100%' gap={styles.g1} className='no-padding items-end'>
                    <Label className='lh' fontSize={styles.fxl}  fontWeight='700' color={styles.white}>Player 2</Label>
                    <Container width='100%' height='100%'  className='bg-white no-padding '>
                    <div ref={player2} style={{backgroundColor:'red', width:'100%', height:'100%'}} />
                    </Container>
                </Container>
            </Container>
            <Container className='no-padding' width='100%' height='100%' center>
            <canvas ref={gameCanvas}></canvas>
            </Container>

        </Container>
    );
}

export default GamePage;
