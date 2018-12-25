package com.bnsilu.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.PublicKey;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;

public class RSAUtil {
	/*
	 *  传入的keySize要大于512，建议1024，512已被攻破
	 *  私钥自己要保存好，公钥交给前端即可
	 */
	public static void generateKeyPair(int keySize,String keySaveLocation) throws Exception {
		//添加bc密码包，否则解析不了BC，需要用到bcprov-jdk16-1.46.jar，BC：（轻量级密码术包)是一种用于 Java 平台的开放源码的轻量级密码术包;它支持大量的密码术算法,并提供JCE 1.2.1的实现）
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA","BC");
		
		keyPairGenerator.initialize(keySize);
		
		KeyPair keyPair = keyPairGenerator.generateKeyPair();
		RSAPublicKey rsaPublicKey = (RSAPublicKey)keyPair.getPublic();
		RSAPrivateKey rsaPrivateKey = (RSAPrivateKey)keyPair.getPrivate();
		
		//byte[] rsaPublicKeyEncode = rsaPublicKey.getEncoded();
		//byte[] rsaPrivateKeyEncode = rsaPrivateKey.getEncoded();
		//加密后的字符串
		String pubencodeBase64String = Base64.encodeBase64String(rsaPublicKey.getEncoded());
		String priencodeBase64String = Base64.encodeBase64String(rsaPrivateKey.getEncoded());
		//System.out.println(pubencodeBase64String);
		//System.out.println(priencodeBase64String);
		
		/*
		Map<String,Object> map = new HashMap<String, Object>();
		map.put("public", rsaPublicKeyEncode);
		map.put("private", rsaPrivateKeyEncode);
		*/
		OutputStream pubOut = new FileOutputStream(new File(keySaveLocation,"key.pub"));
		pubOut.write(pubencodeBase64String.getBytes());
		OutputStream priOut = new FileOutputStream(new File(keySaveLocation,"key.pri"));
		priOut.write(priencodeBase64String.getBytes());
		
		pubOut.close();
		priOut.close();
		System.out.println("生成成功,文件位置保存在 "+new File(keySaveLocation,"key.pub").getPath()+" 和 "+new File(keySaveLocation,"key.pri").getPath());
	}
	
	
	public String decipher(String cipherText) throws Exception {
		String str = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAK6Wx/TC4CSIfJwjdWAmnketrx5bxA3e5OIYuhEgBLG7kEvPymwEigxxSWyXHjySrBlOGwOaEHeeYKg7OhzDOYpj5vefas7OyfOT20dxtvgAUffFKZnCbYI8rW+ST4b7z7ET+SZ/K92qhjWBmZp3UdRhdK/ntAvCfZJ5PfM9OPJzAgMBAAECgYADjX5DKWmVBLv/hZ1rHxUrIXTwpHzZOr4yYhRRcXL3AV0JZB7MxOjgsA0/nLi8hAkd8ZjGIX1JvWlCcyDBU2ogP8ZjskKlN+ZQ3T6Sg7BBqNNri3sKc+JcRLbw4VPYruCXql5D4GgAPlrJ9MSEbXDF" + 
				"NfR27iDqWcjOtOomV08g3QJBAOhwsQjGf3Of5WrWhcs+m6vEtTRVGoB5bpgkVkFhzDcdFeyBMk6p" + 
				"b6nZCLuCLURL9FVZSh2trCP/0Meg23y9xHcCQQDASPqLJNpF73pqAlxPLtkLuvioq4QJ/YR4A5KP" + 
				"3o1Q8juLV/+0yGRFu7GLwxjqZxsbPPsNW5uUM6E4eMYfmmzlAkBVGX0XU2UyNeZOmT/ey4s+9gPJ" + 
				"pybOxqag+RzDT0TvIKz4K8z5U7tYGefCjsR37r8DyG8EMqOFgpEzpUb2gpu9AkEAgz8M7H7aEdRV" + 
				"LRixY0bp1Uzov1BbDuqhSb2+gz74HGFK7WDCY+ZIMyTbGjevwQdhhCUKg2Kc/fqDt+UP7rBcVQJB" + 
				"AJquTpZjtxnTSwmC+fYP0KNo8ZkcjFTvJZmQ037IufDLJ4kbjK4i0x1qJpu3JXMopKbDutFRqr8V" + 
				"rNwQ1PJ5Nak=";
		
		PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(str.getBytes()));
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		PrivateKey pk = keyFactory.generatePrivate(pkcs8EncodedKeySpec);
		Cipher cipher = Cipher.getInstance("RSA");    
		cipher.init(Cipher.DECRYPT_MODE, pk);
		byte[] decodeBase64 = Base64.decodeBase64(cipherText);
		byte[] doFinal4 = cipher.doFinal(decodeBase64);
		
		return new String(doFinal4);
	}
	
	
	public static void main(String[] args) throws Exception {
		generateKeyPair(1024,"c:/");
	}
	
	

}
