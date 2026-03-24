import Head from 'next/head'
import dynamic from "next/dynamic";
import styles from '@/styles/Home.module.css'
import { useState, FormEvent } from 'react';

// we load this with ssr false as it does not support server side rendering
const VNC = dynamic(() => import('@/components/vnc').then(mod => mod.VNC), {ssr: false});

interface ConnectionConfig {
  host: string;
  port: number;
  password: string;
}

const DEFAULT_PORT = 5900;

export default function Home() {
  const [config, setConfig] = useState<ConnectionConfig | null>(null);
  const [host, setHost] = useState('');
  const [port, setPort] = useState(String(DEFAULT_PORT));
  const [password, setPassword] = useState('');

  function handleConnect(e: FormEvent) {
    e.preventDefault();
    if (!host || !password) return;
    setConfig({
      host,
      port: parseInt(port, 10) || DEFAULT_PORT,
      password,
    });
  }

  return (
    <>
      <Head>
        <title>tailvnc</title>
        <meta name="description" content="Browser-based VNC client using Tailscale" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {config ? (
          <VNC host={config.host} port={config.port} password={config.password} />
        ) : (
          <form className={styles.form} onSubmit={handleConnect}>
            <h1 className={styles.title}>tailvnc</h1>
            <label className={styles.label}>
              Host
              <input
                className={styles.input}
                type="text"
                value={host}
                onChange={e => setHost(e.target.value)}
                placeholder="100.x.y.z"
                required
              />
            </label>
            <label className={styles.label}>
              Port
              <input
                className={styles.input}
                type="number"
                value={port}
                onChange={e => setPort(e.target.value)}
                placeholder={String(DEFAULT_PORT)}
                min="1"
                max="65535"
              />
            </label>
            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <button className={styles.button} type="submit">Connect</button>
          </form>
        )}
      </main>
    </>
  )
}
