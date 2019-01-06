package com.bnsilu.util;

import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import com.sun.org.apache.xml.internal.security.utils.Base64;


public class AesEncryptUtil {

    //使用AES-128-CBC加密模式，key需要为16位,key和iv可以相同！
    private static String KEY = "dufy20170329java";

    private static String IV = "dufy20170329java";


    /**
     * 加密方法
     * @param data  要加密的数据
     * @param key 加密key
     * @param iv 加密iv
     * @return 加密的结果
     * @throws Exception
     */
    public static String encrypt(String data, String key, String iv) throws Exception {
        try {

            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");//"算法/模式/补码方式"
            int blockSize = cipher.getBlockSize();

            byte[] dataBytes = data.getBytes();
            int plaintextLength = dataBytes.length;
            if (plaintextLength % blockSize != 0) {
                plaintextLength = plaintextLength + (blockSize - (plaintextLength % blockSize));
            }

            byte[] plaintext = new byte[plaintextLength];
            System.arraycopy(dataBytes, 0, plaintext, 0, dataBytes.length);

            SecretKeySpec keyspec = new SecretKeySpec(key.getBytes(), "AES");
            IvParameterSpec ivspec = new IvParameterSpec(iv.getBytes());

            cipher.init(Cipher.ENCRYPT_MODE, keyspec, ivspec);
            byte[] encrypted = cipher.doFinal(plaintext);

            return Base64.encode(encrypted);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 解密方法
     * @param data 要解密的数据
     * @param key  解密key
     * @param iv 解密iv
     * @return 解密的结果
     * @throws Exception
     */
    public static String desEncrypt(String data, String key, String iv) throws Exception {
        try {
            byte[] encrypted1 = Base64.decode(data);

            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
            SecretKeySpec keyspec = new SecretKeySpec(key.getBytes(), "AES");
            IvParameterSpec ivspec = new IvParameterSpec(iv.getBytes());

            cipher.init(Cipher.DECRYPT_MODE, keyspec, ivspec);

            byte[] original = cipher.doFinal(encrypted1);
            
            int length = getVirtualValueLength(original);
            
            String originalString = new String(original,0,length);
            return originalString;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 使用默认的key和iv加密
     * @param data
     * @return
     * @throws Exception
     */
    public static String encrypt(String data) throws Exception {
        return encrypt(data, KEY, IV);
    }

    /**
     * 使用默认的key和iv解密
     * @param data
     * @return
     * @throws Exception
     */
    public static String desEncrypt(String data) throws Exception {
        return desEncrypt(data, KEY, IV);
    }



    /**
    * 测试
    */
    public static void main(String args[]) throws Exception {

        String test = "18729990110";

        String data = null;
        String key = "dufy20170329java";
        String iv = "dufy20170329java";

        data = encrypt(test, key, iv);

        System.out.println(data);
        System.out.println(desEncrypt("mE159nppZ+CY/ZV40m8UUA==", key, iv));
    }
    
    public static int getVirtualValueLength(byte[] buf){
        int i = 0;
        for (; i < buf.length; i++) {
            if (buf[i] == (byte) 0){
                break;
            }
        }
        return i;
    }
    
    public static String desPwd(String password) {
    	Subject currentUser = SecurityUtils.getSubject();
		Session session = currentUser.getSession();
		Map<String,String> map = (Map<String,String>)session.getAttribute("validateCode");
		String desEncrypt = null;
		try {
			if(map != null) {
				String key = map.get("key");
				String iv = map.get("iv");
			    desEncrypt = AesEncryptUtil.desEncrypt(password,key,iv);
			}
			session.removeAttribute("validateCode");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return desEncrypt;
    }

}