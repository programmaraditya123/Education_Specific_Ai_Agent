import speedtest
from fastapi.responses import JSONResponse

def speedtest_info():
    try:
        st=speedtest.Speedtest()
        #at = speedtest.Speedtest()
        st.get_best_server()

        download_speed=st.download()/1_000_000
        upload_speed=st.upload()/1_000_000
        ping=st.results.ping
        server_info=st.get_best_server()
        isp=st.results.client['isp']
        #ser = at.get_servers()

        response = {
            'download_speed':round(download_speed,2),
            'upload_speed':round(upload_speed),
            'ping':round(ping,2),
            'server':{
                'host': server_info['host'],
                'name': server_info['name'],
                'country': server_info['country'],
                'lat': server_info['lat'],
                'lon': server_info['lon'],
                
            },
            'isp':isp
            #'server':ser
        }

        return JSONResponse(status_code=200,content={'message':response})
        # return jsonify(response)
    except Exception as e:
        return JSONResponse(status_code=500,content={'error':str(e)})
        # return jsonify({'error':str(e)}),500



def get_servers():
    try:
        st = speedtest.Speedtest()
        servers = st.get_servers()  

        server_list = []
        for server_id, server_details in servers.items():
            for server in server_details:
                server_list.append({
                    'id': server['id'],
                    'host': server['host'],
                    'name': server['name'],
                    'country': server['country'],
                    'lat': server['lat'],
                    'lon': server['lon'],
                    'sponsor': server['sponsor'],
                    'distance': server['d']
                })

        # return jsonify({'servers': server_list})
        return JSONResponse(status_code=200,content={'servers': server_list})
    except Exception as e:
        return JSONResponse(status_code=500,content={'error':str(e)})
        # return jsonify({'error': str(e)}), 500